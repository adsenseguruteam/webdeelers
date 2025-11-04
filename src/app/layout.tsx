import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/userContext";

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://www.webdeelers.com/"),
	title: {
		default: "WebDeelers - Buy & Sell Digital Assets | Trusted Marketplace",
		template: "%s | WebDeelers",
	},
	description:
		"WebDeelers is the trusted marketplace for buying and selling digital assets. Discover websites, YouTube channels, social media accounts, mobile apps, SaaS products, and more. Buy verified digital properties with complete metrics and analytics.",
	keywords: [
		"buy digital assets",
		"sell digital assets",
		"digital marketplace",
		"buy website",
		"sell website",
		"YouTube channel for sale",
		"buy Instagram account",
		"buy TikTok account",
		"mobile app marketplace",
		"SaaS marketplace",
		"ecommerce store for sale",
		"digital assets marketplace",
		"verified digital properties",
		"buy social media account",
		"digital business for sale",
		"WebDeelers",
	],
	authors: [{ name: "WebDeelers" }],
	creator: "WebDeelers",
	publisher: "WebDeelers",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		title: "WebDeelers - Buy & Sell Digital Assets | Trusted Marketplace",
		description:
			"WebDeelers is the trusted marketplace for buying and selling digital assets. Discover websites, YouTube channels, social media accounts, mobile apps, SaaS products, and more.",
		siteName: "WebDeelers",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "WebDeelers - Digital Assets Marketplace",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "WebDeelers - Buy & Sell Digital Assets",
		description:
			"The trusted marketplace for buying and selling digital assets. Discover verified digital properties with complete metrics.",
		images: ["/og-image.png"],
		creator: "@webdeelers",
		site: "@webdeelers",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	alternates: {
		canonical: "/",
	},
	category: "Digital Assets Marketplace",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head suppressHydrationWarning>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<meta name='theme-color' content='#f8fafc' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='default'
				/>
				{/* Structured Data - Organization */}
				<script
					type='application/ld+json'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "WebDeelers",
							url: "https://www.webdeelers.com/",
							logo: "/logo.png",
							description:
								"Trusted marketplace for buying and selling digital assets",
							sameAs: [
								"https://twitter.com/webdeelers",
								"https://facebook.com/webdeelers",
								"https://linkedin.com/company/webdeelers",
							],
							contactPoint: {
								"@type": "ContactPoint",
								contactType: "Customer Service",
								email: "support@webdeelers.com",
							},
						}),
					}}
				/>
				{/* Structured Data - WebSite */}
				<script
					type='application/ld+json'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: "WebDeelers",
							url: "https://www.webdeelers.com/",
							potentialAction: {
								"@type": "SearchAction",
								target: {
									"@type": "EntryPoint",
									urlTemplate:
										"https://www.webdeelers.com/marketplace",
								},
								"query-input":
									"required name=search_term_string",
							},
						}),
					}}
				/>
				{/* Structured Data - Marketplace */}
				<script
					type='application/ld+json'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "OnlineStore",
							name: "WebDeelers",
							description:
								"Buy and sell digital assets including websites, YouTube channels, social media accounts, mobile apps, and SaaS products",
							url: "https://www.webdeelers.com/",
							priceRange: "$$",
						}),
					}}
				/>
				{/* Google Analytics Script */}
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX'
				/>
				<script
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-XXXXXXXXXXXXX');
						`,
					}}
				/>
				{/* <script
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX'
					crossOrigin='anonymous'
				/> */}
			</head>
			<body
				className={`${geistSans.className} bg-gray-50`}
				suppressHydrationWarning>
				<AuthProvider>
					<Navbar />
					{children}
					<Toaster />
					<MobileBottomNav />
				</AuthProvider>
				<Footer />
			</body>
		</html>
	);
}
