import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getDataFromToken } from "@/lib/auth";

// GET /api/cart - Get user's cart
export async function GET(request) {
	try {
		const userId = getDataFromToken(request);
		if (!userId) {
			return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();

		return NextResponse.json({
			success: true,
			cart: cart ? cart.items : [],
		});
	} catch (error) {
		console.error("Error fetching cart:", error);
		return NextResponse.json({ success: false, message: "Failed to fetch cart" }, { status: 500 });
	}
}

// POST /api/cart - Add item or update cart
export async function POST(request) {
	try {
		const userId = getDataFromToken(request);
		if (!userId) {
			return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { productId, quantity = 1, action = "add", items } = body;
		await connectDB();

		let cart = await Cart.findOne({ user: userId });

		if (!cart) {
			cart = new Cart({ user: userId, items: [] });
		}

		if (action === "add") {
			const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
			if (itemIndex > -1) {
				cart.items[itemIndex].quantity += quantity;
			} else {
				cart.items.push({ product: productId, quantity });
			}
		} else if (action === "update") {
			const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
			if (itemIndex > -1) {
				cart.items[itemIndex].quantity = quantity;
			}
		} else if (action === "sync") {
			// Bulk sync from localStorage items (array of product IDs or objects)
			if (items && Array.isArray(items)) {
				// Simply replace for simplicity during login sync
				cart.items = items.map(id => ({ product: id, quantity: 1 }));
			}
		}

		await cart.save();
		const updatedCart = await Cart.findOne({ user: userId }).populate("items.product").lean();

		return NextResponse.json({
			success: true,
			cart: updatedCart.items,
		});
	} catch (error) {
		console.error("Error updating cart:", error);
		return NextResponse.json({ success: false, message: "Failed to update cart" }, { status: 500 });
	}
}

// DELETE /api/cart - Remove item or clear cart
export async function DELETE(request) {
	try {
		const userId = getDataFromToken(request);
		if (!userId) {
			return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const productId = searchParams.get("productId");
		const clearAll = searchParams.get("clear") === "true";

		await connectDB();
		const cart = await Cart.findOne({ user: userId });

		if (!cart) {
			return NextResponse.json({ success: true, cart: [] });
		}

		if (clearAll) {
			cart.items = [];
		} else if (productId) {
			cart.items = cart.items.filter(item => item.product.toString() !== productId);
		}

		await cart.save();

		return NextResponse.json({
			success: true,
			cart: cart.items,
		});
	} catch (error) {
		console.error("Error clearing cart:", error);
		return NextResponse.json({ success: false, message: "Failed to update cart" }, { status: 500 });
	}
}
