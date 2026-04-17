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
		
		// Build query
		const query = { user: userId };
		if (status) {
			query.status = status;
		}
		
		const skip = (page - 1) * limit;
		
		const [orders, total] = await Promise.all([
			Order.find(query)
				.populate("product", "title thumbnail slug")
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
		
		// Parse request body
		const { 
			productId, // Legacy single item
			productSnapshot, // Legacy single item
			items, // Multi-item array
			amount, 
			finalAmount, 
			currency, 
			paymentMethod, 
			couponCode, 
			transactionId, 
			paymentStatus, 
			status, 
			deliveryStatus 
		} = await request.json();

		// Validate required fields
		if ((!productId && (!items || items.length === 0)) || !finalAmount || !currency) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}
		
		// If amount is not provided, use finalAmount
		const orderAmount = amount || finalAmount;

		// Generate order ID
		const orderId = `ORD-${Date.now()}`;

		// Build order items
		let orderItems = [];
		let productTitles = [];

		if (items && items.length > 0) {
			orderItems = items.map(item => ({
				product: item.productId || item.product,
				snapshot: item.snapshot || {
					title: item.title,
					price: item.price,
					comparePrice: item.comparePrice,
					thumbnail: item.thumbnail,
					category: item.category,
					currency: item.currency || currency
				},
				quantity: item.quantity || 1
			}));
			productTitles = items.map(item => item.title || item.snapshot?.title);
		} else if (productId) {
			// Handle legacy single-item format
			const product = await Product.findById(productId);
			if (!product) {
				return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
			}
			orderItems = [{
				product: productId,
				snapshot: productSnapshot || {
					title: product.title,
					price: product.price,
					comparePrice: product.comparePrice,
					thumbnail: product.thumbnail,
					category: product.category,
					currency: product.currency || currency
				},
				quantity: 1
			}];
			productTitles = [product.title];
		}

		// Create order
		const newOrder = new Order({
			orderId,
			user: userId,
			items: orderItems,
			// Keep legacy fields for backward compatibility if needed by other components
			product: orderItems[0].product,
			productSnapshot: orderItems[0].snapshot,
			
			amount: orderAmount,
			finalAmount,
			currency,
			paymentMethod,
			paymentStatus: paymentStatus || "processing",
			status: status || "processing",
			deliveryStatus: deliveryStatus || "pending",
			couponCode: couponCode || null,
			transactionId: transactionId || null,
			createdAt: new Date(),
		});

		// Bulk increment salesCount
		const productIds = orderItems.map(item => item.product);
		await Product.updateMany(
			{ _id: { $in: productIds } }, 
			{ $inc: { salesCount: 1 } }
		);

		// send confirmation email to admin 
		await sendEmail({
			to: EMAIL,
			subject: `New Order: ${orderId}`,
			html: `
				<div style="font-family: sans-serif; padding: 20px;">
					<h2>New Order Received</h2>
					<p>Order ID: <strong>${orderId}</strong></p>
					<p>Total Amount: <strong>${currency} ${finalAmount}</strong></p>
					<p>Payment Method: <strong>${paymentMethod}</strong></p>
					<hr/>
					<h3>Items:</h3>
					<ul>
						${productTitles.map(title => `<li>${title}</li>`).join("")}
					</ul>
				</div>
			`,
		});

		await newOrder.save();

		return NextResponse.json({
			success: true,
			message: "Order created successfully",
			order: {
				_id: newOrder._id,
				orderId: newOrder.orderId,
				status: newOrder.status,
				paymentStatus: newOrder.paymentStatus,
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
