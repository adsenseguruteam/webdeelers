import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getDataFromToken } from "@/lib/auth";
import { sendEmail } from "@/lib/emails";
import { EMAIL } from "@/lib/constant"

// GET /api/orders - Get user's orders
export async function GET(request) {
	try {
		const userId = getDataFromToken(request);
		
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();
		
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		
		const query = { user: userId };
		if (status) {
			query.status = status;
		}
		
		const skip = (page - 1) * limit;
		
		const [orders, total] = await Promise.all([
			Order.find(query)
				.populate("user", "name email")
				.populate("items.product")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Order.countDocuments(query),
		]);
		
		return NextResponse.json({
			success: true,
			orders,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch orders" },
			{ status: 500 }
		);
	}
}

// POST /api/orders - Create a new order
export async function POST(request) {
	try {
		const userId = getDataFromToken(request);
		
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();
		
		const { 
			items, // Array of { productId, quantity }
			amount, 
			finalAmount, 
			currency, 
			paymentMethod, 
			couponCode, 
			transactionId, 
			paymentStatus, 
			status, 
			discountApplied,
			deliveryStatus 
		} = await request.json();

		if (!items || items.length === 0 || !finalAmount || !currency) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Fetch products to create snapshots
		const productIds = items.map(item => item.productId || item.product);
		const productDocs = await Product.find({ _id: { $in: productIds } });

		// Map items to snapshot structure
		const orderItems = items.map(item => {
			const product = productDocs.find(p => p._id.toString() === (item.productId || item.product).toString());
			if (!product) throw new Error(`Product not found: ${item.productId}`);

			return {
				product: product._id,
				quantity: item.quantity || 1,
				snapshot: {
					title: product.title,
					price: product.price,
					currency: product.currency,
					thumbnail: product.thumbnail,
					category: product.category,
				}
			};
		});

		const orderId = `ORD-${Date.now()}`;

		const newOrder = new Order({
			orderId,
			user: userId,
			items: orderItems,			
			amount: amount || finalAmount,
			finalAmount,
			currency,
			paymentMethod,
			discountApplied: discountApplied || 0,
			paymentStatus: paymentStatus || "processing",
			status: status || "processing",
			deliveryStatus: deliveryStatus || "pending",
			couponCode: couponCode || null,
			transactionId: transactionId || null,
		});

		// Bulk increment salesCount
		await Product.updateMany(
			{ _id: { $in: productIds } }, 
			{ $inc: { salesCount: 1 } }
		);

		await newOrder.save();
		
		// Send confirmation email to admin (optional/background)
		sendEmail({
			to: EMAIL,
			subject: `New Order: ${orderId}`,
			html: `
				<div style="font-family: sans-serif; padding: 20px;">
					<h2>New Order Received</h2>
					<p>Order ID: <strong>${orderId}</strong></p>
					<p>Total: <strong>${currency} ${finalAmount}</strong></p>
					<p>Customer: <strong>${userId}</strong></p>
				</div>
			`,
		}).catch(err => console.error("Email error:", err));

		// Clear user's cart on server if payment is being initiated/completed
		const Cart = (await import("@/models/Cart")).default;
		await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

		return NextResponse.json({
			success: true,
			message: "Order created successfully",
			order: {
				_id: newOrder._id,
				orderId: newOrder.orderId,
			}
		});
	} catch (error) {
		console.error("Error creating order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create order" },
			{ status: 500 }
		);
	}
}
