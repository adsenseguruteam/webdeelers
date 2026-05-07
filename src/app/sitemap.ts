import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import Blog from "@/models/Blog";
import Product from "@/models/Product";
import { BASE_URL as baseUrl } from "@/lib/constant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/marketplace`,
			lastModified: new Date(),
			changeFrequency: "hourly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/shop`,
			lastModified: new Date(),
			changeFrequency: "hourly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/guide`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];

	// Fetch active listings from database
	let listingPages: MetadataRoute.Sitemap = [];

	try {
		await connectDB();

		// Get all active and sold listings (public listings)
		const listings = await Listing.find({
			status: { $in: ["active", "sold"] },
		})
			.select("_id updatedAt slug")
			.sort({ updatedAt: -1 })
			.lean();

		listingPages = listings.map((listing) => ({
			url: `${baseUrl}/marketplace/${listing.slug || listing._id}`,
			lastModified: listing.updatedAt
				? new Date(listing.updatedAt)
				: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.8,
		}));
	} catch (error) {
		console.error("Error generating sitemap:", error);
		// Continue with static pages even if database connection fails
	}

	let blogPages: MetadataRoute.Sitemap = [];

	try {
		await connectDB();

		// Get all active blogs
		const blogs = await Blog.find({
			status: "published",
		})
			.select("_id updatedAt slug")
			.sort({ updatedAt: -1 })
			.lean();

		blogPages = blogs.map((blog) => ({
			url: `${baseUrl}/blogs/${blog.slug || blog._id}`,
			lastModified: blog.updatedAt
				? new Date(blog.updatedAt)
				: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.8,
		}));
	} catch (error) {
		console.error("Error generating blog sitemap:", error);
		// Continue with static pages even if database connection fails
	}

	// Fetch active products from database
	let productPages: MetadataRoute.Sitemap = [];

	try {
		await connectDB();

		// Get all active products
		const products = await Product.find({
			status: "active",
		})
			.select("_id updatedAt slug title category salesCount rating isFeatured isBestseller")
			.sort({ updatedAt: -1 })
			.lean();

		productPages = products.map((product) => {
			return {
				url: `${baseUrl}/shop/${product.slug || product._id}`,
				lastModified: product.updatedAt
					? new Date(product.updatedAt)
					: new Date(),
				changeFrequency: "daily" as const,
				priority: 0.9,
			};
		});
	} catch (error) {
		console.error("Error generating product sitemap:", error);
		// Continue with other pages even if database connection fails
	}

	return [...staticPages, ...listingPages, ...blogPages, ...productPages];
}
