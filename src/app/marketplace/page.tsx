"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Search,
	TrendingUp,
	Eye,
	MapPin,
	DollarSign,
	Star,
} from "lucide-react";
import axios from "axios";

const categories = [
	"All",
	"Website",
	"YouTube Channel",
	"Facebook Page",
	"Instagram Page",
	"TikTok Account",
	"Twitter Account",
	"Play Console",
	"AdSense Dashboard",
	"Shopify Store",
	"Dropshipping Store",
	"SaaS",
	"Mobile App",
	"Other",
];

export default function Marketplace() {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchListings = async () => {
			setLoading(true);
			try {
				const query = new URLSearchParams();
				if (selectedCategory !== "All")
					query.append("category", selectedCategory);
				query.append("page", page.toString());

				const response = await axios.get(`/api/listings?${query}`);
				const data = await response.data;
				setListings(data.listings || []);
			} catch (error) {
				console.error("Failed to fetch listings:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchListings();
	}, [selectedCategory, page]);

	const filteredListings = listings.filter((listing: any) =>
		listing.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			<div className='min-h-screen bg-gray-50 p-4 md:p-8'>
				<div className='max-w-7xl mx-auto'>
					{/* Header */}
					<div className='mb-8'>
						<h1 className='text-4xl font-bold text-gray-900 mb-4'>
							Digital Assets Marketplace
						</h1>
						<p className='text-gray-600'>
							Discover and purchase high-quality digital
							properties
						</p>
					</div>

					{/* Search */}
					<div className='mb-8'>
						<div className='relative'>
							<Search
								className='absolute left-3 top-3 text-gray-400'
								size={20}
							/>
							<Input
								placeholder='Search listings...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400'
							/>
						</div>
					</div>

					{/* Categories */}
					<div className='market-category mb-8 overflow-x-auto pb-2'>
						<div className='flex gap-2'>
							{categories.map((cat) => (
								<Button
									key={cat}
									onClick={() => {
										setSelectedCategory(cat);
										setPage(1);
									}}
									variant={
										selectedCategory === cat
											? "default"
											: "outline"
									}
									className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
										selectedCategory === cat
											? "bg-linear-to-br from-blue-500 to-cyan-500 text-white whitespace-nowrap cursor-pointer"
											: "border-gray-300 text-gray-700 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
									}`}>
									{cat}
								</Button>
							))}
						</div>
					</div>

					{/* Listings Grid */}
					{loading ? (
						<div className='grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6'>
							{[...Array(12)].map((_, i) => (
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
					) : filteredListings.length > 0 ? (
						<div className='grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6'>
							{filteredListings.map((listing: any) => (
								<Link
									key={listing._id}
									href={`/listing/${listing._id}`}
									className='group'>
									<Card className='bg-white border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden h-full flex flex-col cursor-pointer'>
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
														listing.status ===
														"sold"
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
																listing.metrics
																	.age
															)}{" "}
															mo
														</p>
													</div>
												)}
												{listing.details
													?.monetization && (
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
														{listing.views || 0}{" "}
														views
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardContent className='p-12 text-center'>
								<TrendingUp
									size={48}
									className='mx-auto text-gray-400 mb-4'
								/>
								<h3 className='text-xl font-semibold text-gray-900 mb-2'>
									No Listings Found
								</h3>
								<p className='text-gray-600'>
									{searchTerm
										? "Try adjusting your search terms."
										: "No listings are available at the moment."}
								</p>
							</CardContent>
						</Card>
					)}

					{/* Pagination */}
					{filteredListings.length > 0 && (
						<div className='flex justify-center gap-4 mt-12'>
							<Button
								onClick={() => setPage(Math.max(1, page - 1))}
								disabled={page === 1}
								className='bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
								variant='outline'>
								Previous
							</Button>
							<span className='text-gray-900 flex items-center'>
								Page {page}
							</span>
							<Button
								onClick={() => setPage(page + 1)}
								className='bg-linear-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
								Next
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
