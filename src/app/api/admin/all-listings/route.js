import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { sendEmail } from "@/lib/emails";
import { generateListingStatusUpdate } from "@/lib/emails";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get("adminId");
		const filter = searchParams.get("filter") || "all";
		const search = searchParams.get("search") || "";
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 15;

		await connectDB();

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Build query
		const query = {};
		if (filter !== "all") {
			query.status = filter;
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ category: { $regex: search, $options: "i" } },
			];
		}

		// Base query for current page
		const listings = await Listing.find(query)
			.populate("seller", "name email emailVerified")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// Get total count for current query
		const totalQueryResult = await Listing.countDocuments(query);

		// Get global stats for cards
		const [
			totalListings,
			activeListings,
			pendingListings,
			rejectedListings,
			soldListings,
			totalValueResult,
		] = await Promise.all([
			Listing.countDocuments(),
			Listing.countDocuments({ status: "active" }),
			Listing.countDocuments({ status: "pending" }),
			Listing.countDocuments({ status: "rejected" }),
			Listing.countDocuments({ status: "sold" }),
			Listing.aggregate([
				{ $match: { status: "active" } },
				{ $group: { _id: null, total: { $sum: "$price" } } },
			]),
		]);

		return NextResponse.json({
			listings,
			pagination: {
				totalListings: totalQueryResult,
				totalPages: Math.ceil(totalQueryResult / limit),
				currentPage: page,
				limit,
			},
			stats: {
				totalListings,
				activeListings,
				pendingListings,
				rejectedListings,
				soldListings,
				totalMarketplaceValue: totalValueResult[0]?.total || 0,
			},
		});
	} catch (error) {
		console.error("Admin all listings fetch error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch listings" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { listingId, action, adminId } = await request.json();

		await connectDB();
		const adminNote = "Have an issue, contact to admin on +917755089819";

		const admin = await User.findById(adminId);
		if (!admin || admin.role !== "admin") {
			return NextResponse.json(
				{ MessageChannel: "Unauthorized" },
				{ status: 401 }
			);
		}

		if (action === "pending") {
			const listing = await Listing.findByIdAndUpdate(listingId, {
				status: "pending",
			}).populate("seller", "name email");
			// Send email notification to seller about status update
			const emailContent = generateListingStatusUpdate(
				listing.title,
				"pending",
				adminNote
			);

			await sendEmail({
				to: listing.seller.email,
				subject: `Your Listing Status: ${
					"pending".charAt(0).toUpperCase() + "pending".slice(1)
				} - ${listing.title}`,
				html: emailContent,
			});
		} else if (action === "active") {
			const listing = await Listing.findByIdAndUpdate(listingId, {
				status: "active",
			}).populate("seller", "name email");
			// Send email notification to seller about status update
			const emailContent = generateListingStatusUpdate(
				listing.title,
				"active",
				adminNote
			);

			await sendEmail({
				to: listing.seller.email,
				subject: `Your Listing Status: ${
					"active".charAt(0).toUpperCase() + "active".slice(1)
				} - ${listing.title}`,
				html: emailContent,
			});
		} else if (action === "sold") {
			const listing = await Listing.findByIdAndUpdate(listingId, {
				status: "sold",
			}).populate("seller", "name email");
			const user = await User.findById(listing.seller._id);
			user.totalSales += listing.price;
			await user.save();
			// Send email notification to seller about status update
			const emailContent = generateListingStatusUpdate(
				listing.title,
				"sold",
				adminNote
			);

			await sendEmail({
				to: listing.seller.email,
				subject: `Your Listing Status: ${
					"sold".charAt(0).toUpperCase() + "sold".slice(1)
				} - ${listing.title}`,
				html: emailContent,
			});
		} else if (action === "rejected") {
			const listing = await Listing.findByIdAndUpdate(listingId, {
				status: "rejected",
			}).populate("seller", "name email");
			// Send email notification to seller about status update
			const emailContent = generateListingStatusUpdate(
				listing.title,
				"rejected",
				adminNote
			);

			await sendEmail({
				to: listing.seller.email,
				subject: `Your Listing Status: ${
					"rejected".charAt(0).toUpperCase() + "rejected".slice(1)
				} - ${listing.title}`,
				html: emailContent,
			});
		} else if (action === "draft") {
			const listing = await Listing.findByIdAndUpdate(listingId, {
				status: "draft",
			}).populate("seller", "name email");
			// Send email notification to seller about status update
			const emailContent = generateListingStatusUpdate(
				listing.title,
				"draft",
				adminNote
			);

			await sendEmail({
				to: listing.seller.email,
				subject: `Your Listing Status: ${
					"draft".charAt(0).toUpperCase() + "draft".slice(1)
				} - ${listing.title}`,
				html: emailContent,
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin listing action error:", error);
		return NextResponse.json(
			{ message: "Failed to perform action" },
			{ status: 500 }
		);
	}
}
