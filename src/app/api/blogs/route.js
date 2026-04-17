import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getDataFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails";
import { EMAIL } from "@/lib/constant"

export async function GET(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const userId = searchParams.get("userId");
		const category = searchParams.get("category");
		const search = searchParams.get("search");
		const limit = parseInt(searchParams.get("limit")) || 10;
		const page = parseInt(searchParams.get("page")) || 1;

		let query = {};
		if (status) query.status = status;
		if (userId) query.author = userId;
		if (category && category !== "All") query.category = category;
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ content: { $regex: search, $options: "i" } },
			];
		}

		const blogs = await Blog.find(query)
			.populate("author", "name avatar")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		const total = await Blog.countDocuments(query);

		return NextResponse.json({
			success: true,
			blogs,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
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
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		// Admin can post without limits
		if (user.role === "admin") {
			const body = await request.json();

			// Ensure slug uniqueness
			if (body.slug) {
				const existingBlog = await Blog.findOne({ slug: body.slug });
				if (existingBlog) {
					return NextResponse.json(
						{
							success: false,
							message:
								"A blog with this slug already exists. Please choose a different slug.",
						},
						{ status: 400 }
					);
				}
			}

			const newBlog = await Blog.create({
				...body,
				author: userId,
				status: "published", // Admin posts are auto-published
			});
			return NextResponse.json({ success: true, blog: newBlog });
		}

		const body = await request.json();
		const requestedStatus = body.status === "draft" ? "draft" : "pending";

		// If saving as draft, skip limit checks
		if (requestedStatus === "draft") {
			// Ensure slug uniqueness
			if (body.slug) {
				const existingBlog = await Blog.findOne({ slug: body.slug });
				if (existingBlog) {
					return NextResponse.json(
						{
							success: false,
							message:
								"A blog with this slug already exists. Please choose a different slug.",
						},
						{ status: 400 }
					);
				}
			}

			const newBlog = await Blog.create({
				...body,
				author: userId,
				status: "draft",
			});
			return NextResponse.json({ success: true, blog: newBlog });
		}

		// Ensure slug uniqueness
		if (body.slug) {
			const existingBlog = await Blog.findOne({ slug: body.slug });
			if (existingBlog) {
				return NextResponse.json(
					{
						success: false,
						message:
							"A blog with this slug already exists. Please choose a different slug.",
					},
					{ status: 400 }
				);
			}
		}

		const newBlog = await Blog.create({
			...body,
			author: userId,
			status: "pending", // User posts need approval? "review all blogs"
		});

		// New blog Notification to admin
		await sendEmail({
			to: EMAIL,
			subject: `New Blog for Review`,
			html: "<p>There is a new blog post for review.</p><p>Blog ID: " + newBlog._id + "</p><p>Blog Title: " + newBlog.title + "</p><p>Author: " + user.name + "</p>",
			})

		// Update user stats
		await user.save();

		return NextResponse.json({ success: true, blog: newBlog });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
