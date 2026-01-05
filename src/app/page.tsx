"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	TrendingUp,
	Shield,
	Zap,
	Users,
	Globe,
	Smartphone,
	ShoppingCart,
	BarChart3,
	ArrowRight,
	Filter,
	X,
	Eye,
	MapPin,
	DollarSign,
	Star,
	MessageCircle,
	Facebook,
	Mail,
	Phone,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
	const [listings, setListings] = useState([]);
	const [allListings, setAllListings] = useState([]);
	const [loading, setLoading] = useState(true);

	// Filter states
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedCountry, setSelectedCountry] = useState("All");
	const [priceRange, setPriceRange] = useState({ min: "", max: "" });
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Fetch all listings without pagination to get full dataset for filtering
				const response = await fetch("/api/listings?page=1");
				const data = await response.json();
				const fetchedListings = data.listings || [];
				setAllListings(fetchedListings);
				setListings(fetchedListings);
			} catch (error) {
				console.error("Failed to fetch listings:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchListings();
	}, []);

	// Get unique countries from listings
	const uniqueCountries = useMemo(() => {
		const countries = new Set<string>();
		allListings.forEach((listing: any) => {
			if (listing.metrics?.country) {
				countries.add(listing.metrics.country);
			}
		});
		return Array.from(countries).sort();
	}, [allListings]);

	// Filter listings based on filters
	useEffect(() => {
		let filtered = [...allListings];

		// Category filter
		if (selectedCategory !== "All") {
			filtered = filtered.filter(
				(listing: any) => listing.category === selectedCategory
			);
		}

		// Country filter
		if (selectedCountry !== "All") {
			filtered = filtered.filter(
				(listing: any) => listing.metrics?.country === selectedCountry
			);
		}

		// Price filter
		if (priceRange.min) {
			filtered = filtered.filter(
				(listing: any) => listing.price >= Number(priceRange.min)
			);
		}
		if (priceRange.max) {
			filtered = filtered.filter(
				(listing: any) => listing.price <= Number(priceRange.max)
			);
		}

		setListings(filtered);
	}, [selectedCategory, selectedCountry, priceRange, allListings]);

	const clearFilters = () => {
		setSelectedCategory("All");
		setSelectedCountry("All");
		setPriceRange({ min: "", max: "" });
	};

	const hasActiveFilters =
		selectedCategory !== "All" ||
		selectedCountry !== "All" ||
		priceRange.min !== "" ||
		priceRange.max !== "";

	const categories = [
		{ name: "Website", icon: Globe },
		{ name: "YouTube Channel", icon: TrendingUp },
		{ name: "Social Media", icon: Users },
		{ name: "Mobile App", icon: Smartphone },
		{ name: "E-commerce", icon: ShoppingCart },
		{ name: "SaaS", icon: BarChart3 },
	];

	const features = [
		{
			icon: Shield,
			title: "Verified Sellers",
			description:
				"All sellers are verified and their assets are thoroughly checked",
		},
		{
			icon: Zap,
			title: "Fast Transactions",
			description: "Secure payment processing with instant confirmation",
		},
		{
			icon: TrendingUp,
			title: "Detailed Metrics",
			description:
				"Complete performance data and analytics for every asset",
		},
		{
			icon: Users,
			title: "Expert Support",
			description: "24/7 customer support to help with your transactions",
		},
	];

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
			{/* Hero Section */}
			<section className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 lg:py-28 overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-sky-200/30 to-blue-200/30 rounded-full blur-3xl -z-10' />
				<div className='absolute bottom-0 left-0 w-96 h-96 bg-linear-to-br from-cyan-200/30 to-emerald-200/30 rounded-full blur-3xl -z-10' />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10'>
					<div className='text-center lg:text-left'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-sky-50 to-blue-50 rounded-full border border-sky-200 mb-6'>
							<Shield size={16} className='text-sky-600' />
							<span className='text-sm font-semibold text-sky-700'>
								Trusted Marketplace
							</span>
						</div>
						<h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight'>
							Buy & Sell Digital Assets with Confidence
						</h1>
						<p className='text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0'>
							Deelzo is the trusted marketplace for digital
							entrepreneurs. Discover, evaluate, and acquire
							high-quality digital properties.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
							<Link href='/marketplace'>
								<Button className='bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-8 py-6 text-base md:text-lg gap-2 shadow-lg shadow-sky-500/20 transition-all duration-200 hover:scale-105'>
									Browse Marketplace
									<ArrowRight size={20} />
								</Button>
							</Link>
							<Link href='/guide'>
								<Button
									variant='outline'
									className='border-2 border-slate-300 cursor-pointer text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-6 text-base md:text-lg transition-all duration-200'>
									Learn More
								</Button>
							</Link>
						</div>
					</div>

					{/* Hero Image */}
					<div className='relative'>
						<Image
							src='./home.svg'
							height={500}
							width={500}
							alt='hero image'
						/>
						{/* <div className='absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl blur-3xl opacity-10' />
						<div className='relative bg-linear-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg'>
							<div className='space-y-4'>
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className='h-20 bg-gray-200 rounded-lg animate-pulse'
									/>
								))}
							</div>
						</div> */}
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16'>
				<div className='text-center mb-8 md:mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-3'>
						Browse by Category
					</h2>
					<p className='text-slate-600 text-base md:text-lg'>
						Explore digital assets across different categories
					</p>
				</div>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
					{categories.map((cat) => {
						const Icon = cat.icon;
						return (
							<Link
								key={cat.name}
								href={`/marketplace?category=${cat.name}`}>
								<Card className='bg-white border border-slate-200 hover:border-sky-500 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 group'>
									<CardContent className='p-4 md:p-6 text-center'>
										<div className='w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl bg-linear-to-br from-sky-50 to-blue-50 flex items-center justify-center group-hover:from-sky-100 group-hover:to-blue-100 transition-all duration-300'>
											<Icon
												size={24}
												className='text-sky-600 group-hover:scale-110 transition-transform duration-300'
											/>
										</div>
										<p className='text-slate-900 font-semibold text-xs md:text-sm group-hover:text-sky-600 transition-colors'>
											{cat.name}
										</p>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</section>

			{/* Featured Listings with Filters */}
			<section className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8'>
					<div>
						<h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-2'>
							Featured Listings
						</h2>
						{listings.length > 0 && (
							<p className='text-slate-600 text-base'>
								{listings.length}{" "}
								{listings.length === 1 ? "listing" : "listings"}{" "}
								available
							</p>
						)}
					</div>
					<div className='flex flex-wrap gap-2 md:gap-3'>
						<Button
							onClick={() => setShowFilters(!showFilters)}
							variant='outline'
							className='border-slate-200 cursor-pointer text-slate-700 hover:bg-slate-50 hover:border-slate-300 bg-white gap-2 transition-all duration-200'>
							<Filter size={18} />
							<span className='hidden sm:inline'>Filters</span>
							{hasActiveFilters && (
								<span className='ml-1 px-2 py-0.5 bg-sky-600 text-white text-xs rounded-full font-semibold'>
									{[
										selectedCategory !== "All" ? 1 : 0,
										selectedCountry !== "All" ? 1 : 0,
										priceRange.min !== "" ? 1 : 0,
										priceRange.max !== "" ? 1 : 0,
									].reduce((a, b) => a + b, 0)}
								</span>
							)}
						</Button>
						{hasActiveFilters && (
							<Button
								onClick={clearFilters}
								variant='outline'
								className='border-slate-200 cursor-pointer text-slate-700 hover:bg-slate-50 hover:border-slate-300 bg-white gap-2 transition-all duration-200'>
								<X size={18} />
								<span className='hidden sm:inline'>Clear</span>
							</Button>
						)}
						<Link href='/marketplace'>
							<Button
								variant='outline'
								className='border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 bg-white transition-all duration-200'>
								View All
							</Button>
						</Link>
					</div>
				</div>

				{/* Filters Panel */}
				{showFilters && (
					<Card className='bg-white border border-slate-200 mb-8 shadow-lg'>
						<CardContent className='p-4 md:p-6'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
								{/* Category Filter */}
								<div>
									<label className='text-sm font-semibold text-gray-700 mb-2 block'>
										Category
									</label>
									<select
										value={selectedCategory}
										onChange={(e) =>
											setSelectedCategory(e.target.value)
										}
										className='w-full h-10 rounded-md border border-gray-300 bg-white text-gray-900 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
										<option value='All'>
											All Categories
										</option>
										{categories.map((cat) => (
											<option
												key={cat.name}
												value={cat.name}>
												{cat.name}
											</option>
										))}
									</select>
								</div>

								{/* Country Filter */}
								<div>
									<label className='text-sm font-semibold text-gray-700 mb-2 block'>
										Country
									</label>
									<select
										value={selectedCountry}
										onChange={(e) =>
											setSelectedCountry(e.target.value)
										}
										className='w-full h-10 rounded-md border border-gray-300 bg-white text-gray-900 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
										<option value='All'>
											All Countries
										</option>
										{uniqueCountries.map((country) => (
											<option
												key={country}
												value={country}>
												{country}
											</option>
										))}
									</select>
								</div>

								{/* Price Range Filter */}
								<div>
									<label className='text-sm font-semibold text-gray-700 mb-2 block'>
										Price Range
									</label>
									<div className='flex gap-2'>
										<Input
											type='number'
											placeholder='Min'
											value={priceRange.min}
											onChange={(e) =>
												setPriceRange({
													...priceRange,
													min: e.target.value,
												})
											}
											className='bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
										/>
										<Input
											type='number'
											placeholder='Max'
											value={priceRange.max}
											onChange={(e) =>
												setPriceRange({
													...priceRange,
													max: e.target.value,
												})
											}
											className='bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Listings Grid */}
				{loading ? (
					<div className='grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6'>
						{[...Array(10)].map((_, i) => (
							<Card
								key={i}
								className='bg-white border-gray-200 overflow-hidden shadow-sm'>
								<CardContent className='p-0'>
									<div className='w-full h-48 bg-gray-200 animate-pulse' />
									<div className='p-4 space-y-3'>
										<div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse' />
										<div className='h-3 w-1/2 bg-gray-200 rounded animate-pulse' />
										<div className='h-6 w-1/3 bg-gray-200 rounded animate-pulse' />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : listings.length === 0 ? (
					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='p-12 text-center'>
							<TrendingUp
								size={48}
								className='mx-auto text-gray-400 mb-4'
							/>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>
								No Listings Found
							</h3>
							<p className='text-gray-600 mb-4'>
								{hasActiveFilters
									? "Try adjusting your filters to see more results."
									: "No listings are available at the moment."}
							</p>
							{hasActiveFilters && (
								<Button
									onClick={clearFilters}
									variant='outline'
									className='border-gray-300 text-gray-700 hover:bg-gray-100'>
									Clear Filters
								</Button>
							)}
						</CardContent>
					</Card>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
						{listings.map((listing: any) => (
							<Link
								key={listing._id}
								href={`/marketplace/${
									listing.slug || listing._id
								}`}
								className='group'>
								<Card className='bg-white p-0 border border-slate-200 hover:border-sky-500 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 overflow-hidden h-full flex flex-col gap-1 cursor-pointer hover:-translate-y-1'>
									{/* Image */}
									<div className='relative w-full h-48 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200'>
										{listing.thumbnail ||
										(listing.images &&
											listing.images[0]) ? (
											<img
												src={
													listing.thumbnail ||
													listing.images[0]
												}
												alt={listing.title}
												className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center'>
												<TrendingUp
													size={40}
													className='text-blue-500'
												/>
											</div>
										)}
										{/* Status Badge */}
										<div className='absolute top-2 right-2'>
											<span
												className={`${
													listing.status === "sold"
														? "bg-red-500/90 text-white"
														: "bg-green-500/90 text-white"
												} text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-lg`}>
												{listing.status === "sold"
													? "Sold"
													: "Active"}
											</span>
										</div>
										{/* Featured Badge */}
										{listing.featured && (
											<div className='absolute top-2 left-2'>
												<span className='bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-lg flex items-center gap-1'>
													<Star
														size={12}
														fill='currentColor'
													/>
													Featured
												</span>
											</div>
										)}
									</div>

									{/* Content */}
									<CardContent className='p-4 flex-1 flex flex-col'>
										{/* Title & Category */}
										<div className='mb-3'>
											<h3 className='text-gray-900 font-bold text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors'>
												{listing.title}
											</h3>
											<div className='flex items-center gap-2 text-xs text-gray-600'>
												<span className='px-2 py-0.5 bg-gray-100 rounded'>
													{listing.category}
												</span>
											</div>
										</div>

										{/* Price */}
										<div className='mb-3'>
											<div className='flex items-baseline gap-1'>
												<DollarSign
													size={16}
													className='text-blue-400'
												/>
												<span className='text-2xl font-bold text-gray-900'>
													{Number(
														listing.price
													).toLocaleString()}
												</span>
											</div>
										</div>

										{/* Metrics Grid */}
										<div className='grid grid-cols-2 gap-2 mb-3 flex-1'>
											{listing.metrics
												?.monthlyRevenue && (
												<div className='bg-gray-50 rounded-lg p-2 border border-gray-200'>
													<p className='text-[10px] text-gray-600 mb-0.5'>
														Revenue/Month
													</p>
													<p className='text-xs font-semibold text-green-400'>
														$
														{Number(
															listing.metrics
																.monthlyRevenue
														).toLocaleString()}
													</p>
												</div>
											)}
											{listing.metrics
												?.monthlyTraffic && (
												<div className='bg-gray-50 rounded-lg p-2 border border-gray-200'>
													<p className='text-[10px] text-gray-600 mb-0.5'>
														Traffic/Month
													</p>
													<p className='text-xs font-semibold text-blue-400'>
														{Number(
															listing.metrics
																.monthlyTraffic
														).toLocaleString()}
													</p>
												</div>
											)}
											{listing.metrics?.followers && (
												<div className='bg-gray-50 rounded-lg p-2 border border-gray-200'>
													<p className='text-[10px] text-gray-600 mb-0.5'>
														Followers
													</p>
													<p className='text-xs font-semibold text-purple-400'>
														{Number(
															listing.metrics
																.followers
														).toLocaleString()}
													</p>
												</div>
											)}
											{listing.metrics?.age && (
												<div className='bg-gray-50 rounded-lg p-2 border border-gray-200'>
													<p className='text-[10px] text-gray-600 mb-0.5'>
														Age
													</p>
													<p className='text-xs font-semibold text-orange-400'>
														{Number(
															listing.metrics.age
														)}{" "}
														mo
													</p>
												</div>
											)}
											{listing.details?.monetization && (
												<div className='bg-gray-50 rounded-lg p-2 border border-gray-200'>
													<p className='text-[10px] text-gray-600 mb-0.5'>
														Monetization
													</p>
													<p className='text-xs font-semibold text-orange-400'>
														{
															listing.details
																.monetization
														}
													</p>
												</div>
											)}
										</div>

										{/* Bottom Info */}
										<div className='flex items-center justify-between pt-3 border-t border-gray-200'>
											{listing.metrics?.country && (
												<div className='flex items-center gap-1 text-xs text-gray-600'>
													<MapPin size={12} />
													<span>
														{
															listing.metrics
																.country
														}
													</span>
												</div>
											)}
											<div className='flex items-center gap-1 text-xs text-gray-600'>
												<Eye size={12} />
												<span>
													{listing.views || 0} views
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				)}
			</section>

			{/* About Section */}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-12'>
				<div className='grid md:grid-cols-2 gap-12 items-center'>
					<div className='space-y-6'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
							About Deelzo
						</h2>
						<p className='text-lg text-gray-600'>
							Deelzo is a premier marketplace for digital assets,
							founded by AdSense Guru (Amit Singh). With over 4
							years of experience in digital marketing and website
							development, we've created a trusted platform for
							buying and selling digital properties.
						</p>
						<div className='flex flex-wrap gap-4'>
							<div className='flex items-center gap-2 text-gray-600'>
								<Mail size={18} className='text-gray-500' />
								<span>evtnorg@gmail.com</span>
							</div>
							<div className='flex items-center gap-2 text-gray-600'>
								<Phone size={18} className='text-gray-500' />
								<span>+91 7755089819</span>
							</div>
						</div>
						<div className='flex flex-wrap gap-4'>
							<Link href='/about' className='inline-flex'>
								<Button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3'>
									About Us
								</Button>
							</Link>
							<Link
								href='https://www.facebook.com/adsenseguruteam'
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex'>
								<Button
									variant='outline'
									className='border-gray-300 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors hover:bg-gray-50 px-6 py-3'>
									<Facebook size={18} />
									Follow on Facebook
								</Button>
							</Link>
						</div>
					</div>
					<div className='space-y-6'>
						<div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
							<h3 className='text-xl font-semibold text-gray-900 mb-4'>
								Join Our Community
							</h3>
							<div className='space-y-3'>
								<a
									href='https://chat.whatsapp.com/BDahUf9nbFk7tY3ry27bIZ'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-green-700 transition-colors'>
									<MessageCircle className='w-5 h-5' />
									<span>Join WhatsApp Group</span>
								</a>
								<a
									href='https://www.facebook.com/groups/adsenseguruteam'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-blue-700 transition-colors'>
									<Facebook className='w-5 h-5' />
									<span>Join Facebook Group</span>
								</a>
								<a
									href='https://wa.me/917755089819'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-3 p-3 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 text-cyan-700 transition-colors'>
									<MessageCircle className='w-5 h-5' />
									<span>Connect on WhatsApp</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* Features */}
			<section className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16'>
				<div className='text-center mb-8 md:mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-slate-900 mb-3'>
						Why Choose Deelzo?
					</h2>
					<p className='text-slate-600 text-base md:text-lg'>
						Experience the best in digital asset trading
					</p>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<Card
								key={index}
								className='bg-white border border-slate-200 hover:border-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 group'>
								<CardContent className='p-6'>
									<div className='w-14 h-14 rounded-xl bg-linear-to-br from-sky-50 to-blue-50 flex items-center justify-center mb-4 group-hover:from-sky-100 group-hover:to-blue-100 transition-all duration-300'>
										<Icon
											size={28}
											className='text-sky-600 group-hover:scale-110 transition-transform duration-300'
										/>
									</div>
									<h3 className='font-bold text-slate-900 mb-2 text-lg'>
										{feature.title}
									</h3>
									<p className='text-slate-600 text-sm leading-relaxed'>
										{feature.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			{/* CTA Section */}
			<section className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16'>
				<div className='relative bg-linear-to-br from-sky-600 via-blue-600 to-cyan-600 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl overflow-hidden'>
					{/* Background decoration */}
					<div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
					<div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />

					<div className='relative z-10'>
						<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4'>
							Ready to Get Started?
						</h2>
						<p className='text-white/90 mb-8 text-base md:text-lg max-w-2xl mx-auto'>
							Join thousands of digital entrepreneurs buying and
							selling assets on Deelzo
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Link href='/marketplace'>
								<Button className='bg-white hover:bg-slate-50 cursor-pointer text-sky-600 px-8 py-6 text-base md:text-md font-semibold shadow-lg hover:scale-105 transition-all duration-200'>
									Start Browsing
									<ArrowRight size={20} className='ml-2' />
								</Button>
							</Link>
							<Link href='/guide'>
								<Button className='bg-white hover:bg-slate-50 cursor-pointer text-sky-600 px-8 py-6 text-base md:text-md font-semibold shadow-lg hover:scale-105 transition-all duration-200'>
									Learn How to Sell
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
