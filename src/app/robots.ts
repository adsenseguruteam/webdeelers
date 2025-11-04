import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://www.webdeelers.com/";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/admin/",
					"/dashboard/",
					"/signup",
					"/forgot-password",
					"/reset-password",
					"/verify-otp",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
