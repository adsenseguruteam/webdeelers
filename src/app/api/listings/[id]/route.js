import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

function extractIdFromRequest(request) {
	const url = new URL(request.url, process.env.NEXT_PUBLIC_APP_URL);
	const pathParts = url.pathname.split("/");
	return pathParts[pathParts.length - 1];
}

export async function GET(request) {
	try {
		await connectDB();
		const id = extractIdFromRequest(request);

		const listing = await Listing.findByIdAndUpdate(
			id,
			{ $inc: { views: 1 } },
			{ new: true }
		)
			.populate("seller")
			.populate({
				path: "bids",
				populate: {
					path: "bidder",
					select: "name email phone",
				},
			});

		if (!listing) {
			return NextResponse.json(
				{ message: "Listing not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(listing);
	} catch (error) {
		console.error("Listing fetch error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch listing" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { userId, ...updateData } = await request.json();

		const id = extractIdFromRequest(request);

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();

		const listing = await Listing.findById(id);
		if (!listing || listing.seller.toString() !== userId) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const updated = await Listing.findByIdAndUpdate(id, updateData, {
			new: true,
		});
		if (updated.status === "sold") {
			const user = await User.findById(userId);
			user.totalSales += listing.price;
			await user.save();
		}

		return NextResponse.json({ success: true, listing: updated });
	} catch (error) {
		console.error("Listing update error:", error);
		return NextResponse.json(
			{ message: "Failed to update listing" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {
		const id = extractIdFromRequest(request);
		const { userId } = await request.json();

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();

		const listing = await Listing.findById(id);
		if (!listing || listing.seller.toString() !== userId) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await Listing.findByIdAndDelete(id);
		await User.findByIdAndUpdate(userId, {
			$pull: { listings: id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Listing deletion error:", error);
		return NextResponse.json(
			{ message: "Failed to delete listing" },
			{ status: 500 }
		);
	}
}
