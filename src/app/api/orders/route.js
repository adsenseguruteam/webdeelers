import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getDataFromToken } from "@/lib/auth";

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
