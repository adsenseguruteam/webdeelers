import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { sendEmail } from "@/lib/emails";
import { EMAIL } from "@/lib/constant";

export async function POST(request) {
	try {
		// PayU sends data as URL-encoded form data
		const formData = await request.formData();
		
		const status = formData.get("status");
		const firstname = formData.get("firstname");
		const amount = formData.get("amount");
		const txnid = formData.get("txnid");
		const hash = formData.get("hash");
		const key = formData.get("key");
		const productinfo = formData.get("productinfo");
		const email = formData.get("email");
		
		const udf1 = formData.get("udf1"); // userId
		const udf2 = formData.get("udf2"); // productId
		const udf3 = formData.get("udf3"); // JSON order context
		const udf4 = formData.get("udf4");
		const udf5 = formData.get("udf5");
		
		const additionalCharges = formData.get("additionalCharges") || "";

		const salt = process.env.PAYU_MERCHANT_SALT;

		if (!salt) {
			console.error("PayU Salt is missing");
			return NextResponse.redirect(new URL("/dashboard/orders?payment=error", request.url));
		}

		// Calculate reverse hash to verify authenticity
		let reverseHashString = "";
		if (additionalCharges) {
			reverseHashString = `${additionalCharges}|${salt}|${status}||||||${udf5 || ""}|${udf4 || ""}|${udf3 || ""}|${udf2 || ""}|${udf1 || ""}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
		} else {
			reverseHashString = `${salt}|${status}||||||${udf5 || ""}|${udf4 || ""}|${udf3 || ""}|${udf2 || ""}|${udf1 || ""}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
		}
		
		const calculatedHash = crypto.createHash("sha512").update(reverseHashString).digest("hex");

		if (calculatedHash !== hash) {
			console.error("PayU Hash mismatch", { received: hash, calculated: calculatedHash });
			return NextResponse.redirect(new URL("/dashboard/orders?payment=failed", request.url));
		}

		// Ensure we connect to the database
		await connectDB();

		const productId = udf2;
		// Check if transaction was successful
		if (status === "success") {
			// Find if order already exists
			const existingOrder = await Order.findOne({ transactionId: txnid });
			
			if (existingOrder) {
			    // Payment already processed for this txnid
			    return NextResponse.redirect(new URL("/dashboard/orders?payment=success", request.url));
			}

            const product = await Product.findById(productId);
            // We proceed even if product isn't found, mapping basic details just in case
			const orderContext = udf3 ? JSON.parse(udf3) : {};

			// Generate order ID
			const orderId = `ORD-${Date.now()}`;

			// Create order
			const newOrder = new Order({
				orderId,
				user: udf1, // Set from frontend
				product: productId,
				productSnapshot: {
					title: product?.title || productinfo,
					price: product?.price || amount,
					comparePrice: product?.comparePrice,
					thumbnail: product?.thumbnail,
					category: product?.category,
				},
				amount: product?.price || amount,
				finalAmount: orderContext.finalAmount || amount,
				currency: orderContext.currency || "INR",
				paymentMethod: "payu",
				paymentStatus: "completed",
				status: "completed",
				deliveryStatus: "delivered",
				couponCode: orderContext.couponCode || null,
        transactionId: txnid,
				paidAt: new Date(),
				createdAt: new Date(),
			});

            if (product) {
			    await Product.findByIdAndUpdate(productId, { $inc: { salesCount: 1 } });
            }

			// Send confirmation email to admin (matching orders/route.js)
			try {
				await sendEmail({
					to: EMAIL,
					subject: `New Order: ${newOrder.productSnapshot.title}`,
					html: "<p>There is a new order for your product.</p><p>Order ID: " + orderId + "</p><p>Product: " + newOrder.productSnapshot.title + "</p><p>Amount: " + newOrder.finalAmount + " " + newOrder.currency + "</p>",
				});
			} catch (emailError) {
				console.error("Failed to send notification email:", emailError);
			}

			await newOrder.save();
			
			// Redirect user back to UI using 303 See Other, which forces a GET request
			return NextResponse.redirect(new URL("/dashboard/orders?payment=success", request.url), { status: 303 });
		} else {
			// Payment failed or is pending
			console.log(`PayU Payment ${status} for txnid: ${txnid}`);
			return NextResponse.redirect(new URL(`/shop/checkout?product=${productId}`, request.url), { status: 303 });
		}

	} catch (error) {
		console.error("Error processing PayU callback:", error);
		return NextResponse.redirect(new URL("/shop?payment=failed", request.url), { status: 303 });
	}
}
