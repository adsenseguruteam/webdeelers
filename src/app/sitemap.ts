import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.webdeelers.com";

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
			.select("_id updatedAt")
			.sort({ updatedAt: -1 })
			.lean();

		listingPages = listings.map((listing) => ({
			url: `${baseUrl}/listing/${listing._id}`,
			lastModified: listing.updatedAt
				? new Date(listing.updatedAt)
				: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		}));
	} catch (error) {
		console.error("Error generating sitemap:", error);
		// Continue with static pages even if database connection fails
	}

	return [...staticPages, ...listingPages];
}
