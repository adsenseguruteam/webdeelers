import mongoose from "mongoose";
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
