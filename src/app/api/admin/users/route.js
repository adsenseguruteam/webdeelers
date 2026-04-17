import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import Blog from "@/models/Blog";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 15;
		const search = searchParams.get("search") || "";
		const filter = searchParams.get("filter") || "all";

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Build query for pagination and searching
		const query = {};
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ phone: { $regex: search, $options: "i" } },
			];
		}

		if (filter === "blocked") query.isBlocked = true;
		if (filter === "premium") query.currentPlan = "premium";
		if (filter === "verified") query.verified = true;

		// Get paginated users
		const users = await User.find(query)
			.select("-password")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// Get global stats for cards (regardless of current page/filter)
		const [
			totalUsers,
			verifiedUsers,
			blockedUsers,
			premiumUsers,
			totalListingsResult,
			totalSalesResult,
		] = await Promise.all([
			User.countDocuments(),
			User.countDocuments({ verified: true }),
			User.countDocuments({ isBlocked: true }),
			User.countDocuments({ currentPlan: "premium" }),
			User.aggregate([
				{ $project: { listingsCount: { $size: "$listings" } } },
				{ $group: { _id: null, total: { $sum: "$listingsCount" } } },
			]),
			User.aggregate([
				{ $group: { _id: null, total: { $sum: "$totalSales" } } },
			]),
		]);

		// Get stats for CURRENT query (for total pages)
		const totalQueryResult = await User.countDocuments(query);

		// Fetch order and blog counts for each paginated user
		const usersWithCounts = await Promise.all(
			users.map(async (u) => {
				const [orderCount, blogCount] = await Promise.all([
					Order.countDocuments({ user: u._id }),
					Blog.countDocuments({ author: u._id }),
				]);
				return {
					...u.toObject(),
					orderCount,
					blogCount,
				};
			})
		);

		return NextResponse.json({
			users: usersWithCounts,
			pagination: {
				totalUsers: totalQueryResult,
				totalPages: Math.ceil(totalQueryResult / limit),
				currentPage: page,
				limit,
			},
			stats: {
				totalUsers,
				verifiedUsers,
				blockedUsers,
				premiumUsers,
				totalActiveListings: totalListingsResult[0]?.total || 0,
				totalPlatformSales: totalSalesResult[0]?.total || 0,
			},
		});
	} catch (error) {
		console.error("Admin users fetch error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { userId, action, adminId, updates } = await request.json();

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (action === "verify") {
			await User.findByIdAndUpdate(userId, { verified: true });
		} else if (action === "unverify") {
			await User.findByIdAndUpdate(userId, { verified: false });
		} else if (action === "block") {
			await User.findByIdAndUpdate(userId, { isBlocked: true });
		} else if (action === "unblock") {
			await User.findByIdAndUpdate(userId, { isBlocked: false });
		} else if (action === "update" && updates) {
			// Update user details
			const updateData = {};
			if (updates.name !== undefined) updateData.name = updates.name;
			if (updates.email !== undefined) updateData.email = updates.email;
			if (updates.phone !== undefined) updateData.phone = updates.phone;
			if (updates.bio !== undefined) updateData.bio = updates.bio;
			if (updates.location !== undefined) updateData.location = updates.location;
			if (updates.company !== undefined) updateData.company = updates.company;

			await User.findByIdAndUpdate(userId, updateData);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin user update error:", error);
		return NextResponse.json(
			{ message: "Failed to update user" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");
		const userId = searchParams.get("userId");
		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}
		await User.findByIdAndDelete(userId);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin user delete error:", error);
		return NextResponse.json(
			{ message: "Failed to delete user" },
			{ status: 500 }
		);
	}
}
