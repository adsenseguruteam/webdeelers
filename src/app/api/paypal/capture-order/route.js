import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import { getDataFromToken } from "@/lib/auth";
import { sendEmail } from "@/lib/emails";
import { EMAIL } from "@/lib/constant";

export async function POST(request) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { orderID, cartData } = await request.json();

        if (!orderID) {
            return NextResponse.json({ success: false, message: "Missing Order ID" }, { status: 400 });
        }

        // 1. Capture the payment via PayPal
        const captureData = await capturePayPalOrder(orderID);

        // 2. Verify capture was successful
        if (captureData.status !== "COMPLETED") {
            return NextResponse.json({ 
                success: false, 
                message: "Payment not completed" 
            }, { status: 400 });
        }

        await connectDB();

        // 3. Resolve Items for Snapshot (similar to PayU logic)
        const productIds = cartData.items.map(item => item.productId);
        const dbProducts = await Product.find({ _id: { $in: productIds } });
        
        const orderItems = cartData.items.map(item => {
            const product = dbProducts.find(p => p._id.toString() === item.productId);
            return {
                product: item.productId,
                quantity: item.quantity || 1,
                snapshot: {
                    title: product?.title || "Item",
                    price: product?.price || 0,
                    currency: product?.currency || "USD",
                    thumbnail: product?.thumbnail || "",
                    category: product?.category || "Digital",
                }
            };
        });

        const orderId = `ORD-PP-${Date.now()}`;

        // 4. Create the final order in DB
        const newOrder = new Order({
            orderId,
            user: userId,
            items: orderItems,
            amount: cartData.totalAmount, // Base amount (Net)
            finalAmount: cartData.finalAmount, // Total including 7% fee
            currency: cartData.currency || "USD",
            discountApplied: cartData.discountApplied || 0,
            couponCode: cartData.couponCode || null,
            paymentMethod: "paypal",
            paymentStatus: "completed",
            status: "completed",
            deliveryStatus: "delivered",
            transactionId: captureData.id, // PayPal Capture ID
            notes: `PayPal processing fee applied: ${cartData.currency} ${cartData.paypalFee || 0}`,
        });

        await newOrder.save();

        // 5. Update sales count
        await Product.updateMany(
            { _id: { $in: productIds } }, 
            { $inc: { salesCount: 1 } }
        );

        // 6. Clear user's cart
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        // 7. Send confirmation email
        sendEmail({
            to: EMAIL,
            subject: `New PayPal Order: ${orderId}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>New PayPal Order Received</h2>
                    <p>Order ID: <strong>${orderId}</strong></p>
                    <p>Total: <strong>${cartData.currency} ${cartData.finalAmount}</strong></p>
                    <p>Customer ID: <strong>${userId}</strong></p>
                    <p>Transaction ID: <strong>${captureData.id}</strong></p>
                </div>
            `,
        }).catch(err => console.error("Email error:", err));

        return NextResponse.json({
            success: true,
            message: "Order completed successfully",
            order: {
                _id: newOrder._id,
                orderId: newOrder.orderId,
            }
        });
    } catch (error) {
        console.error("PayPal Capture Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to capture PayPal order" 
        }, { status: 500 });
    }
}
