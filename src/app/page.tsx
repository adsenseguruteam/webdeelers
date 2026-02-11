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
	Sparkles,
	ArrowUpRight,
	Activity,
	Target,
	Layers,
	Cpu,
	MousePointer,
} from "lucide-react";
import { EMAIL, PHONE } from "@/lib/constant";

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
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
			<style jsx global>{`
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}
			`}</style>
			
			{/* Hero Section */}
			<section className='relative overflow-hidden'>
				{/* Animated Background Elements */}
				<div className='absolute inset-0 overflow-hidden pointer-events-none'>
					<div className='absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/40 to-rose-200/40 rounded-full blur-3xl animate-pulse' />
					<div className='absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-sky-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-full blur-3xl' />
					
					{/* Floating dots pattern */}
					<div className='absolute inset-0 opacity-30'>
						{[...Array(20)].map((_, i) => (
							<div suppressHydrationWarning
								key={i}
								className='absolute w-2 h-2 bg-orange-400/40 rounded-full animate-bounce'
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									animationDelay: `${Math.random() * 2}s`,
									animationDuration: `${3 + Math.random() * 2}s`,
								}}
							/>
						))}
					</div>
				</div>

				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
						{/* Left Content */}
						<div className='text-center lg:text-left relative z-10'>
							{/* Badge */}
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 shadow-lg shadow-orange-500/10 mb-6'>
								<span className='text-xs font-bold text-orange-600 uppercase tracking-wider'>#1 Digital Asset Marketplace</span>
							</div>

							{/* Main Heading */}
							<h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]'>
								Buy & Sell
								<br />
								Digital Assets{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 italic font-serif'>
									Smarter
								</span>
							</h1>

							{/* Description */}
							<p className='text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0'>
								Deelzo gives you the tools to discover, evaluate, and acquire 
								high-quality digital properties. From websites to social media accounts.
							</p>

							{/* CTA Buttons */}
							<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10'>
								<Link href='/marketplace'>
									<Button className='bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-6 text-base font-semibold shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 rounded-xl'>
										Get Started
									</Button>
								</Link>
								<Link href='/guide'>
									<Button
										variant='outline'
										className='border-2 border-slate-200 cursor-pointer text-slate-700 hover:bg-white hover:border-orange-300 px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 rounded-xl group'>
										Book a Demo
										<ArrowRight size={18} className='ml-2 group-hover:translate-x-1 transition-transform' />
									</Button>
								</Link>
							</div>

							{/* Social Proof */}
							<div className='flex items-center gap-4 justify-center lg:justify-start'>
								{/* Avatar Stack */}
								<div className='flex -space-x-3'>
									{[0, 1, 2].map((i) => (
										<div
											key={i}
											className='w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center overflow-hidden shadow-md'
										>
											<span className='text-sm font-bold text-orange-600'>{String.fromCharCode(65 + i)}</span>
										</div>
									))}
								</div>
								<div>
									<div className='flex items-center gap-1'>
										<Star size={16} className='text-amber-400 fill-amber-400' />
										<span className='font-bold text-slate-900'>4.9</span>
									</div>
									<p className='text-xs text-slate-500'>(2,500+ reviews)</p>
								</div>
							</div>
						</div>

						{/* Right Content - Hero Visual */}
						<div className='relative lg:h-[600px] flex items-center justify-center'>
							{/* Main Image Container */}
							<div className='relative w-full max-w-lg'>
								{/* Background Card */}
								<div className='absolute inset-0 bg-gradient-to-br from-orange-100/50 to-rose-100/50 rounded-3xl transform rotate-3 scale-105' />
								
								{/* Main Image */}
								<div className='relative bg-white rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden border border-slate-100'>
									<video
										src='/main.mp4'
										height={500}
										width={500}
										autoPlay
										muted
										loop
										className='w-full h-auto object-cover'
									/>
								</div>

								{/* Floating Stats Card - Blog Traffic */}
								<div className='absolute -left-4 md:-left-8 top-1/4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100' style={{ animation: 'float 3s ease-in-out infinite' }}>
									<div className='flex items-center gap-2 mb-2'>
										<Activity size={16} className='text-emerald-500' />
										<span className='text-xs font-medium text-slate-600'>Blog Traffic</span>
										<span className='text-xs font-bold text-emerald-500 flex items-center gap-0.5'>
											<ArrowUpRight size={10} />
											+16.5%
										</span>
									</div>
									<p className='text-2xl font-bold text-slate-900'>125,536</p>
									<p className='text-xs text-slate-400'>Since last week</p>
								</div>

								{/* Floating Stats Card - SEO Analytics */}
								<div className='absolute -right-2 md:-right-4 bottom-1/4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100' style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}>
									<div className='flex items-center gap-2 mb-3'>
										<Target size={16} className='text-orange-500' />
										<span className='text-xs font-medium text-slate-600'>SEO Analytics</span>
										<span className='text-xs font-bold text-emerald-500 flex items-center gap-0.5'>
											<ArrowUpRight size={10} />
											+20%
										</span>
									</div>
									{/* Circular Progress */}
									<div className='relative w-20 h-20 mx-auto'>
										<svg className='w-full h-full transform -rotate-90'>
											<circle
												cx='40'
												cy='40'
												r='32'
												stroke='#f1f5f9'
												strokeWidth='8'
												fill='none'
											/>
											<circle
												cx='40'
												cy='40'
												r='32'
												stroke='url(#gradient)'
												strokeWidth='8'
												fill='none'
												strokeLinecap='round'
												strokeDasharray={`${0.8 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
												className='transition-all duration-1000'
											/>
											<defs>
												<linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
													<stop offset='0%' stopColor='#f97316' />
													<stop offset='100%' stopColor='#f43f5e' />
												</linearGradient>
											</defs>
										</svg>
										<div className='absolute inset-0 flex items-center justify-center'>
											<span className='text-lg font-bold text-slate-900'>80%</span>
										</div>
									</div>
								</div>

								{/* AI Badge */}
								<div className='absolute -right-2 top-8 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg shadow-rose-500/25' style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
									<div className='flex items-center gap-2'>
										<Sparkles size={14} />
										<span className='text-sm font-semibold'>Free Listing</span>
									</div>
								</div>

								{/* Side Icons Panel */}
								<div className='absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3'>
									{[Layers, MousePointer, Cpu, Zap].map((Icon, i) => (
										<div
											key={i}
											className='w-10 h-10 bg-white rounded-xl shadow-lg shadow-slate-200/50 flex items-center justify-center border border-slate-100 hover:scale-110 transition-transform cursor-pointer'
											style={{ animationDelay: `${i * 0.1}s` }}
										>
											<Icon size={18} className='text-slate-400' />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

			</section>

			{/* Categories */}
			<section className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16'>
				<div className='text-center mb-12 md:mb-16'>
					<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full border border-sky-200 mb-6'>
						<Sparkles size={16} className='text-sky-600' />
						<span className='text-sm font-semibold text-sky-700'>Popular Categories</span>
					</div>
					<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4'>
						Browse by Category
					</h2>
					<p className='text-slate-600 text-base md:text-lg max-w-2xl mx-auto'>
						Discover premium digital assets across diverse categories, curated for entrepreneurs and investors
					</p>
				</div>
				
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6'>
					{categories.map((cat, index) => {
						const Icon = cat.icon;
						const gradients = [
							"from-orange-500 to-rose-500",
							"from-sky-500 to-blue-500",
							"from-emerald-500 to-teal-500",
							"from-violet-500 to-purple-500",
							"from-amber-500 to-orange-500",
							"from-cyan-500 to-sky-500",
						];
						const bgGradients = [
							"from-orange-50 to-rose-50",
							"from-sky-50 to-blue-50",
							"from-emerald-50 to-teal-50",
							"from-violet-50 to-purple-50",
							"from-amber-50 to-orange-50",
							"from-cyan-50 to-sky-50",
						];
						const borderColors = [
							"group-hover:border-orange-300",
							"group-hover:border-sky-300",
							"group-hover:border-emerald-300",
							"group-hover:border-violet-300",
							"group-hover:border-amber-300",
							"group-hover:border-cyan-300",
						];
						const iconColors = [
							"text-orange-500",
							"text-sky-500",
							"text-emerald-500",
							"text-violet-500",
							"text-amber-500",
							"text-cyan-500",
						];
						const shadowColors = [
							"group-hover:shadow-orange-500/20",
							"group-hover:shadow-sky-500/20",
							"group-hover:shadow-emerald-500/20",
							"group-hover:shadow-violet-500/20",
							"group-hover:shadow-amber-500/20",
							"group-hover:shadow-cyan-500/20",
						];
						
						return (
							<Link
								key={cat.name}
								href={`/marketplace?category=${cat.name}`}
								className='group'>
								<div className={`relative bg-white rounded-2xl border border-slate-200 ${borderColors[index]} cursor-pointer transition-all duration-500 hover:shadow-2xl ${shadowColors[index]} hover:-translate-y-2 overflow-hidden h-full`}>
									{/* Top gradient bar */}
									<div className={`h-1 w-full bg-gradient-to-r ${gradients[index]} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
									
									<div className='p-6 md:p-8 text-center relative'>
										{/* Background glow effect */}
										<div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
										
										<div className='relative z-10'>
											{/* Icon container with animated border */}
											<div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${bgGradients[index]} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg`}>
												<div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white flex items-center justify-center shadow-md`}>
													<Icon
														size={28}
														className={`${iconColors[index]} group-hover:scale-110 transition-transform duration-300`}
													/>
												</div>
											</div>
											
											{/* Category name */}
											<h3 className='text-slate-900 font-bold text-sm md:text-base group-hover:text-slate-800 transition-colors mb-2'>
												{cat.name}
											</h3>
											
											{/* Explore link */}
											<div className={`inline-flex items-center gap-1 text-xs font-semibold ${iconColors[index]} opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
												<span>Explore</span>
												<ArrowRight size={12} className='group-hover:translate-x-1 transition-transform duration-300' />
											</div>
										</div>
									</div>
									
									{/* Corner decoration */}
									<div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
								</div>
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
			<section className='relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 pointer-events-none' />
				<div className='absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/30 to-rose-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4' />
				<div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-sky-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4' />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					<div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
						{/* Left Content */}
						<div className='space-y-8'>
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-rose-50 rounded-full border border-orange-200'>
								<Sparkles size={16} className='text-orange-500' />
								<span className='text-sm font-semibold text-orange-700'>About Us</span>
							</div>
							
							<h2 className='text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>
								The Most Trusted
								<span className='block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500'>
									Digital Marketplace
								</span>
							</h2>
							
							<p className='text-lg text-slate-600 leading-relaxed'>
								Deelzo is a premier marketplace for digital assets, founded by 
								<span className='font-semibold text-slate-900'>AdSense Guru (Amit Singh)</span>. 
								With over 4 years of experience in digital marketing and website development, 
								we've created a trusted platform for buying and selling digital properties worldwide.
							</p>
							
							{/* Stats */}
							<div className='grid grid-cols-3 gap-6 py-6 border-y border-slate-200'>
								<div className='text-center'>
									<p className='text-3xl md:text-4xl font-bold text-slate-900'>4+</p>
									<p className='text-sm text-slate-500 mt-1'>Years Experience</p>
								</div>
								<div className='text-center border-x border-slate-200'>
									<p className='text-3xl md:text-4xl font-bold text-slate-900'>2.5K+</p>
									<p className='text-sm text-slate-500 mt-1'>Happy Clients</p>
								</div>
								<div className='text-center'>
									<p className='text-3xl md:text-4xl font-bold text-slate-900'>98%</p>
									<p className='text-sm text-slate-500 mt-1'>Success Rate</p>
								</div>
							</div>
							
							{/* Contact Info */}
							<div className='flex flex-wrap gap-6'>
								<div className='flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
									<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center'>
										<Mail size={18} className='text-orange-600' />
									</div>
									<div>
										<p className='text-xs text-slate-500'>Email</p>
										<p className='text-sm font-semibold text-slate-900'>{EMAIL}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
									<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center'>
										<MessageCircle size={18} className='text-sky-600' />
									</div>
									<div>
										<p className='text-xs text-slate-500'>WhatsApp</p>
										<p className='text-sm font-semibold text-slate-900'>{PHONE}</p>
									</div>
								</div>
							</div>
							
							<div className='flex flex-wrap gap-4'>
								<Link href='/about' className='inline-flex'>
									<Button className='bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 rounded-xl'>
										Learn More
										<ArrowRight size={18} className='ml-2' />
									</Button>
								</Link>
								<Link
									href='https://www.facebook.com/adsenseguruteam'
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex'>
									<Button
										variant='outline'
										className='border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-8 py-6 text-base font-semibold transition-all duration-300 rounded-xl group'>
										<Facebook size={18} className='mr-2 text-blue-600' />
										Follow Us
									</Button>
								</Link>
							</div>
						</div>
						
						{/* Right Content - Community Card */}
						<div className='relative'>
							{/* Decorative elements */}
							<div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl opacity-20 rotate-12' />
							<div className='absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-400 rounded-full opacity-20' />
							
							<div className='relative bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-10'>
								<div className='flex items-center gap-3 mb-8'>
									<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/25'>
										<Users size={24} className='text-white' />
									</div>
									<div>
										<h3 className='text-2xl font-bold text-slate-900'>Join Our Community</h3>
										<p className='text-sm text-slate-500'>Connect with 10,000+ members</p>
									</div>
								</div>
								
								<div className='space-y-4'>
									<a
										href='https://chat.whatsapp.com/BDahUf9nbFk7tY3ry27bIZ'
										target='_blank'
										rel='noopener noreferrer'
										className='group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
										<div className='w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform'>
											<MessageCircle size={24} className='text-white' />
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-slate-900'>WhatsApp Group</p>
											<p className='text-sm text-slate-500'>Daily updates & discussions</p>
										</div>
										<ArrowRight size={18} className='text-green-600 group-hover:translate-x-1 transition-transform' />
									</a>
									
									<a
										href='https://www.facebook.com/groups/adsenseguruteam'
										target='_blank'
										rel='noopener noreferrer'
										className='group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
										<div className='w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform'>
											<Facebook size={24} className='text-white' />
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-slate-900'>Facebook Group</p>
											<p className='text-sm text-slate-500'>Community support & tips</p>
										</div>
										<ArrowRight size={18} className='text-blue-600 group-hover:translate-x-1 transition-transform' />
									</a>
									
									<a
										href={`https://wa.me/${PHONE}`}
										target='_blank'
										rel='noopener noreferrer'
										className='group flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100 rounded-xl border border-cyan-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'>
										<div className='w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform'>
											<Phone size={24} className='text-white' />
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-slate-900'>Direct Support</p>
											<p className='text-sm text-slate-500'>24/7 personal assistance</p>
										</div>
										<ArrowRight size={18} className='text-cyan-600 group-hover:translate-x-1 transition-transform' />
									</a>
								</div>
								
								{/* Trust badges */}
								<div className='mt-8 pt-6 border-t border-slate-100'>
									<p className='text-xs text-slate-400 text-center mb-4'>Trusted by digital entrepreneurs worldwide</p>
									<div className='flex justify-center gap-4'>
										{[Shield, Zap, Star].map((Icon, i) => (
											<div key={i} className='w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center'>
												<Icon size={18} className='text-slate-400' />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* Features */}
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
				{/* Background pattern */}
				<div className='absolute inset-0 opacity-10'>
					<div className='absolute inset-0' style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
				</div>
				<div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-rose-500/20 rounded-full blur-3xl' />
				<div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-full blur-3xl' />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					<div className='text-center mb-16 md:mb-20'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6'>
							<Sparkles size={16} className='text-orange-400' />
							<span className='text-sm font-semibold text-white'>Why Choose Us</span>
						</div>
						<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6'>
							Built for Success
						</h2>
						<p className='text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'>
							Experience a platform designed with security, speed, and transparency at its core
						</p>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
						{features.map((feature, index) => {
							const Icon = feature.icon;
							const gradients = [
								"from-emerald-500 to-teal-500",
								"from-orange-500 to-rose-500",
								"from-sky-500 to-blue-500",
								"from-violet-500 to-purple-500",
							];
							const glowColors = [
								"group-hover:shadow-emerald-500/25",
								"group-hover:shadow-orange-500/25",
								"group-hover:shadow-sky-500/25",
								"group-hover:shadow-violet-500/25",
							];
							
							return (
								<div
									key={index}
									className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl ${glowColors[index]} hover:-translate-y-2 overflow-hidden`}>
									{/* Gradient border on hover */}
									<div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
									
									{/* Icon */}
									<div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
										<Icon size={32} className='text-white' />
									</div>
									
									{/* Content */}
									<h3 className='relative text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300'>
										{feature.title}
									</h3>
									<p className='relative text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300'>
										{feature.description}
									</p>
									
									{/* Arrow indicator */}
									<div className='absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2'>
										<ArrowRight size={14} className='text-white' />
									</div>
								</div>
							);
						})}
					</div>
					
					{/* Bottom stats */}
					<div className='mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8'>
						{[
							{ value: "$10000+", label: "Assets Sold" },
							{ value: "10k+", label: "Active Users" },
							{ value: "99.9%", label: "Uptime" },
							{ value: "24/7", label: "Support" },
						].map((stat, i) => (
							<div key={i} className='text-center'>
								<p className='text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400'>{stat.value}</p>
								<p className='text-slate-400 text-sm mt-1'>{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100'>
				<div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent' />
				<div className='absolute top-40 left-20 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-rose-200/20 rounded-full blur-3xl' />
				<div className='absolute bottom-40 right-20 w-72 h-72 bg-gradient-to-br from-sky-200/20 to-blue-200/20 rounded-full blur-3xl' />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					<div className='text-center mb-16 md:mb-20'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-rose-50 rounded-full border border-orange-200 mb-6'>
							<Sparkles size={16} className='text-orange-500' />
							<span className='text-sm font-semibold text-orange-700'>Simple Process</span>
						</div>
						<h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-4'>
							How It Works
						</h2>
						<p className='text-slate-600 text-lg max-w-2xl mx-auto'>
							Get started in minutes with our simple 3-step process
						</p>
					</div>
					
					<div className='grid md:grid-cols-3 gap-8 md:gap-12'>
						{[
							{ 
								step: "01", 
								title: "Browse Listings", 
								description: "Explore thousands of verified digital assets across multiple categories. Filter by price, metrics, and location.",
								icon: Globe,
								color: "from-orange-500 to-rose-500"
							},
							{ 
								step: "02", 
								title: "Connect & Negotiate", 
								description: "Message sellers directly, ask questions, and negotiate terms. Our secure platform protects both parties.",
								icon: MessageCircle,
								color: "from-sky-500 to-blue-500"
							},
							{ 
								step: "03", 
								title: "Secure Transaction", 
								description: "Complete your purchase with our escrow protection. Transfer assets safely and receive payment securely.",
								icon: Shield,
								color: "from-emerald-500 to-teal-500"
							},
						].map((item, index) => {
							const Icon = item.icon;
							return (
								<div key={index} className='relative group'>
									{/* Connector line */}
									{index < 2 && (
										<div className='hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-200'>
											<div className='absolute inset-0 bg-gradient-to-r from-orange-200 via-sky-200 to-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
										</div>
									)}
									
									<div className='relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 group-hover:border-slate-300'>
										{/* Step number */}
										<div className={`absolute -top-4 left-8 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
											<span className='text-white font-bold text-lg'>{item.step}</span>
										</div>
										
										<div className='pt-6'>
											<div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} opacity-10 flex items-center justify-center mb-6 group-hover:opacity-20 transition-opacity`}>
												<Icon size={32} className={`text-transparent bg-clip-text bg-gradient-to-br ${item.color}`} />
											</div>
											<h3 className='text-xl font-bold text-slate-900 mb-3'>{item.title}</h3>
											<p className='text-slate-600 leading-relaxed'>{item.description}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
				<div className='absolute inset-0 opacity-5'>
					<div className='absolute inset-0' style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
				</div>
				<div className='absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-full blur-3xl' />
				<div className='absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-full blur-3xl' />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					<div className='text-center mb-16'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6'>
							<Star size={16} className='text-orange-400' />
							<span className='text-sm font-semibold text-white'>Testimonials</span>
						</div>
						<h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
							Loved by Entrepreneurs
						</h2>
						<p className='text-slate-400 text-lg max-w-2xl mx-auto'>
							See what our community has to say about their experience
						</p>
					</div>
					
					<div className='grid md:grid-cols-3 gap-6 md:gap-8'>
						{[
							{
								quote: "Deelzo made selling my website incredibly easy. The verification process gave buyers confidence, and I got a great price!",
								author: "Rajesh Kumar",
								role: "Sold Website for $45K",
								rating: 5
							},
							{
								quote: "I've bought multiple YouTube channels through Deelzo. The detailed metrics and secure transactions are unmatched.",
								author: "Priya Sharma",
								role: "Digital Investor",
								rating: 5
							},
							{
								quote: "The support team is amazing! They guided me through my first purchase and made sure everything went smoothly.",
								author: "Amit Patel",
								role: "First-time Buyer",
								rating: 5
							},
						].map((testimonial, index) => (
							<div key={index} className='group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2'>
								{/* Quote icon */}
								<div className='absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg'>
									<span className='text-white text-2xl font-serif'>"</span>
								</div>
								
								{/* Rating */}
								<div className='flex gap-1 mb-4'>
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star key={i} size={16} className='text-amber-400 fill-amber-400' />
									))}
								</div>
								
								<p className='text-slate-300 leading-relaxed mb-6'>{testimonial.quote}</p>
								
								<div className='flex items-center gap-3'>
									<div className='w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center'>
										<span className='text-white font-bold'>{testimonial.author.charAt(0)}</span>
									</div>
									<div>
										<p className='text-white font-semibold'>{testimonial.author}</p>
										<p className='text-slate-400 text-sm'>{testimonial.role}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600' />
				<div className='absolute inset-0 opacity-20'>
					<div className='absolute inset-0' style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
				</div>
				
				{/* Floating elements */}
				<div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse' />
				<div className='absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse' style={{ animationDelay: '1s' }} />
				<div className='absolute top-1/2 left-20 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse' style={{ animationDelay: '0.5s' }} />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<div className='text-center lg:text-left'>
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6'>
								<Zap size={16} className='text-white' />
								<span className='text-sm font-semibold text-white'>Start Today</span>
							</div>
							<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
								Ready to Transform
								<span className='block'>Your Digital Portfolio?</span>
							</h2>
							<p className='text-white/90 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0'>
								Join 10,000+ entrepreneurs who trust Deelzo for buying and selling premium digital assets.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
								<Link href='/marketplace'>
									<Button className='bg-white hover:bg-slate-50 text-slate-900 px-8 py-6 text-base font-semibold shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl group'>
										Explore Marketplace
										<ArrowRight size={20} className='ml-2 group-hover:translate-x-1 transition-transform' />
									</Button>
								</Link>
								<Link href='/signup'>
									<Button 
										variant='outline' 
										className='border-2 border-white/50 text-gray-900 hover:bg-white/10 px-8 py-6 text-base font-semibold transition-all duration-300 rounded-xl backdrop-blur-sm'>
										Create Free Account
									</Button>
								</Link>
							</div>
						</div>
						
						<div className='hidden lg:block relative'>
							<div className='relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8'>
								<div className='flex items-center gap-4 mb-6'>
									<div className='flex -space-x-3'>
										{[0, 1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className='w-10 h-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-orange-300 to-rose-300 flex items-center justify-center'
											>
												<span className='text-xs font-bold text-slate-800'>{String.fromCharCode(65 + i)}</span>
											</div>
										))}
									</div>
									<div className='text-white'>
										<p className='font-bold'>10,000+</p>
										<p className='text-sm text-white/70'>Active Users</p>
									</div>
								</div>
								
								<div className='space-y-4'>
									<div className='flex items-center gap-3 text-white/90'>
										<div className='w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center'>
											<Shield size={14} className='text-emerald-300' />
										</div>
										<span className='text-sm'>Secure Escrow Protection</span>
									</div>
									<div className='flex items-center gap-3 text-white/90'>
										<div className='w-6 h-6 rounded-full bg-sky-400/20 flex items-center justify-center'>
											<Zap size={14} className='text-sky-300' />
										</div>
										<span className='text-sm'>Instant Asset Transfer</span>
									</div>
									<div className='flex items-center gap-3 text-white/90'>
										<div className='w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center'>
											<Users size={14} className='text-amber-300' />
										</div>
										<span className='text-sm'>24/7 Expert Support</span>
									</div>
								</div>
								
								<div className='mt-6 pt-6 border-t border-white/10'>
									<div className='flex items-center justify-between text-white'>
										<span className='text-sm text-white/70'>Platform Fee</span>
										<span className='font-bold text-emerald-300'>Only 5%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
