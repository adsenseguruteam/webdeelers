import mongoose from "mongoose";
import Plan from "@/models/Plan";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getDataFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { extractParamFromRequest } from "@/lib/utils";

export async function GET(request) {
	try {
		await connectDB();

		const id = extractParamFromRequest(request);
		let blog;

		if (mongoose.Types.ObjectId.isValid(id)) {
			blog = await Blog.findById(id).populate("author", "name avatar");
		}

		if (!blog) {
			blog = await Blog.findOne({ slug: id }).populate(
				"author",
				"name avatar"
			);
		}

		if (!blog) {
			return NextResponse.json(
				{ success: false, message: "Blog not found" },
				{ status: 404 }
			);
		}

		// Increment views
		await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

		return NextResponse.json({ success: true, blog });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		await connectDB();
		const userId = getDataFromToken(request);
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await User.findById(userId);
		const id = extractParamFromRequest(request);
		const body = await request.json();

		const blog = await Blog.findById(id);
		if (!blog) {
			return NextResponse.json(
				{ success: false, message: "Blog not found" },
				{ status: 404 }
			);
		}

		// Check permissions
		if (blog.author.toString() !== userId && user.role !== "admin") {
			return NextResponse.json(
				{ success: false, message: "Forbidden" },
				{ status: 403 }
			);
		}

		// If user is updating, reset status to pending (unless admin)
		if (user.role !== "admin") {
			if (body.status !== "draft") {
				body.status = "pending";
			}
		}

		// Fetch Plan details
		// Assuming plan names in User match Plan names in DB (case insensitive)
		const plan = await Plan.findOne({
			name: { $regex: new RegExp(`^${user.currentPlan}$`, "i") },
		});

		if (!plan) {
			// Fallback if plan not found in DB (should not happen if seeded)
			// Default to Free: 1 per week
			// Or return error. Let's return error to enforce plan creation.
			return NextResponse.json(
				{ success: false, message: "Plan configuration not found." },
				{ status: 400 }
			);
		}

		const now = new Date();
		let canPost = false;

		if (plan.frequency === "daily") {
			if (
				!user.lastPostDate ||
				new Date(user.lastPostDate).toDateString() !==
					now.toDateString()
			) {
				canPost = true;
			}
		} else {
			// Weekly
			const oneWeek = 7 * 24 * 60 * 60 * 1000;
			if (
				!user.periodStartDate ||
				now - new Date(user.periodStartDate) > oneWeek
			) {
				// Reset period
				user.postCount = 0;
				user.periodStartDate = now;
			}

			if (user.postCount < plan.postLimit) {
				canPost = true;
			}
		}

		if (!canPost) {
			return NextResponse.json(
				{
					success: false,
					message: `You have reached your limit for the ${user.currentPlan} plan.`,
				},
				{ status: 403 }
			);
		}

		const updatedBlog = await Blog.findByIdAndUpdate(id, body, {
			new: true,
		});
		return NextResponse.json({ success: true, blog: updatedBlog });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {
		await connectDB();
		const userId = getDataFromToken(request);
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await User.findById(userId);
		const id = extractParamFromRequest(request);

		const blog = await Blog.findById(id);
		if (!blog) {
			return NextResponse.json(
				{ success: false, message: "Blog not found" },
				{ status: 404 }
			);
		}

		if (blog.author.toString() !== userId && user.role !== "admin") {
			return NextResponse.json(
				{ success: false, message: "Forbidden" },
				{ status: 403 }
			);
		}

		await Blog.findByIdAndDelete(id);
		return NextResponse.json({ success: true, message: "Blog deleted" });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
