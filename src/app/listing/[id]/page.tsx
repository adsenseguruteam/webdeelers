"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Star,
	Share2,
	TrendingUp,
	Calendar,
	MessageCircle,
	TrendingDown,
	Verified,
	Loader2,
	Copy,
} from "lucide-react";
import axios from "axios";
import { userContext } from "@/context/userContext";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function ListingDetail({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { user } = userContext();
	const router = useRouter();
	const [listing, setListing] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [bidAmount, setBidAmount] = useState("");
	const [bidMessage, setBidMessage] = useState("");
	const [bids, setBids] = useState<any[]>([]);
	const [submittingBid, setSubmittingBid] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const fetchListing = async () => {
		try {
			const response = await axios.get(`/api/listings/${id}`);
			const data = await response.data;
			setListing(data);
			setBidAmount(data?.price.toString());
		} catch (error) {
			console.error("Failed to fetch listing:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchListing();
	}, [id]);

	const handlePlaceBid = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user) {
			router.push("/login");
			return;
		}

		if (!bidAmount || !(Number(bidAmount) < listing?.price)) {
			alert("Bid amount must be at least the asking price");
			return;
		}

		setSubmittingBid(true);
		try {
			const response = await axios.post("/api/bids", {
				listingId: id,
				bidderId: user?._id,
				amount: Number.parseFloat(bidAmount),
				message: bidMessage,
			});

			if (response.data.success) {
				const newBid = await response.data;
				setBids([newBid, ...bids]);
				setBidAmount("");
				setBidMessage("");
				await fetchListing();
				toast.success("Bid placed successfully!");
			}
		} catch (error) {
			console.error("Failed to place bid:", error);
			toast.error("Failed to place bid");
		} finally {
			setSubmittingBid(false);
		}
	};

	const handleContactSeller = (phone: string) => {
		console.log(phone);
		if (!phone || !listing?.title) {
			alert("WhatsApp number not available or listing not found");
			return;
		}
		const message = `Hi, I'm interested in your listing: ${listing?.title}`;
		window.open(
			`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
			"_blank"
		);
	};

	if (loading) {
		return (
			<div className='flex items-center text-gray-900 justify-center min-h-screen bg-gray-50'>
				<Loader2 className='h-12 w-12 animate-spin' />
			</div>
		);
	}

	if (!listing) {
		return (
			<div className='flex items-center text-gray-900 justify-center min-h-screen bg-gray-50'>
				Listing not found
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 p-4 md:p-8 pb-24 md:pb-8'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<Button
						variant='ghost'
						onClick={() => router.back()}
						className='text-gray-700 hover:text-gray-900 mb-4'>
						← Back
					</Button>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Main Content */}
					<div className='lg:col-span-2'>
						{/* Hero Image / Thumbnail */}
						<Card className='bg-white border-gray-200 mb-6 overflow-hidden shadow-sm'>
							<div className='relative w-full h-112 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
								{listing?.thumbnail ? (
									<img
										src={listing.thumbnail}
										onClick={(e) => {
											e.preventDefault();
											setPreviewUrl(listing.thumbnail);
										}}
										alt={
											listing?.title ||
											"Listing thumbnail"
										}
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='text-center'>
										<TrendingUp
											size={48}
											className='text-blue-500 mx-auto mb-2'
										/>
										<p className='text-gray-600'>
											Asset Preview
										</p>
									</div>
								)}
								{listing?.category && (
									<span className='absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900 border border-gray-300 backdrop-blur shadow-sm'>
										{listing.category}
									</span>
								)}
							</div>
						</Card>

						{/* Details */}
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900 text-2xl'>
									{listing?.title}
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-6'>
								<p className='text-gray-600'>
									{listing.description}
								</p>

								{/* Metrics Grid */}
								<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
									{listing.metrics?.assetLink && (
										<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
											<p className='text-xs text-gray-600 mb-1'>
												Link/URL
											</p>
											<Link
												href={listing.metrics.assetLink}
												target='_blank'
												className='text-sm font-semibold text-blue-600 text-wrap hover:text-blue-700'>
												{listing.metrics.assetLink}
											</Link>
										</div>
									)}
									{listing.metrics?.country && (
										<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
											<p className='text-xs text-gray-600 mb-1'>
												Country
											</p>
											<p className='text-xl font-bold text-gray-900'>
												{listing.metrics.country}
											</p>
										</div>
									)}
									{listing.metrics?.monthlyRevenue && (
										<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
											<p className='text-xs text-gray-600 mb-1'>
												Monthly Revenue
											</p>
											<p className='text-xl font-bold text-gray-900'>
												$
												{listing.metrics.monthlyRevenue.toLocaleString()}
											</p>
										</div>
									)}
									{listing.metrics?.monthlyTraffic && (
										<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
											<p className='text-xs text-gray-600 mb-1'>
												Monthly Traffic
											</p>
											<p className='text-xl font-bold text-gray-900'>
												{listing.metrics.monthlyTraffic.toLocaleString()}
											</p>
										</div>
									)}
									{listing.metrics?.followers && (
										<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
											<p className='text-xs text-gray-600 mb-1'>
												Followers
											</p>
											<p className='text-xl font-bold text-gray-900'>
												{listing.metrics.followers.toLocaleString()}
											</p>
										</div>
									)}
									{listing.metrics?.age && (
										<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
											<p className='text-xs text-gray-600 mb-1'>
												Age
											</p>
											<p className='text-xl font-bold text-gray-900'>
												{listing.metrics.age} months
											</p>
										</div>
									)}
								</div>

								{/* Details */}
								{listing.details && (
									<div className='space-y-3 pt-4 border-t border-gray-200'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											{listing.details.niche && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Niche
													</p>
													<p className='text-gray-900 font-semibold'>
														{listing.details.niche}
													</p>
												</div>
											)}
											{listing.details.monetization && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Monetization
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.monetization
														}
													</p>
												</div>
											)}
											{listing.details.trafficSource && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Traffic Source/Reach
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.trafficSource
														}
													</p>
												</div>
											)}
											{listing.details
												.growthPotential && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Growth Potential
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.growthPotential
														}
													</p>
												</div>
											)}
											{listing.details
												.paymentReceived && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Payment Received
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.paymentReceived
														}
													</p>
												</div>
											)}
											{listing.details.adManager && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Ad Manager Used
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.adManager
														}
													</p>
												</div>
											)}
											{listing.details.domainProvider && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Domain Provider
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.domainProvider
														}
													</p>
												</div>
											)}
											{listing.details.domainExpiry && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Domain Expiry
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.domainExpiry
														}
													</p>
												</div>
											)}
											{listing.details.platform && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Platform
													</p>
													<p className='text-gray-900 font-semibold'>
														{
															listing.details
																.platform
														}
													</p>
												</div>
											)}
											{listing.details.issue && (
												<div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
													<p className='text-xs text-gray-600'>
														Any Issues
													</p>
													<p className='text-gray-900 font-semibold'>
														{listing.details.issue}
													</p>
												</div>
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Image Gallery - Masonry */}
						{listing?.images && listing.images.length > 0 && (
							<Card className='bg-gray-100 border-gray-200 mt-6 shadow-sm'>
								<CardHeader>
									<CardTitle className='text-gray-900'>
										Gallery
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:balance]'>
										{(listing.images as string[])
											.filter(
												(img) =>
													img &&
													img !== listing.thumbnail
											)
											.map((img, idx) => (
												<div
													key={idx}
													className='mb-4 break-inside-avoid'>
													<div className='overflow-hidden rounded-lg border border-gray-200 bg-gray-50'>
														<img
															src={img}
															onClick={(e) => {
																e.preventDefault();
																setPreviewUrl(
																	img
																);
															}}
															alt={`Image ${
																idx + 1
															}`}
															className='w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300'
														/>
													</div>
												</div>
											))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Image Preview Lightbox */}
					{previewUrl && (
						<div
							className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
							onClick={() => setPreviewUrl(null)}>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setPreviewUrl(null);
								}}
								className='absolute top-4 right-4 text-gray-900 bg-white/90 hover:bg-white border border-gray-300 rounded-full px-3 py-1 text-sm shadow-lg'>
								Close
							</button>
							<img
								src={previewUrl as string}
								alt='Preview'
								className='max-w-[95vw] max-h-[85vh] object-contain shadow-2xl rounded-lg'
							/>
						</div>
					)}

					{/* Sidebar */}
					<div className='space-y-6'>
						{/* Price Card */}
						<Card className='bg-linear-to-br from-blue-600 to-cyan-600 border-blue-500 shadow-lg'>
							<CardContent className='p-6'>
								<p className='text-white/90 text-sm mb-2'>
									Asking Price
								</p>
								<p className='text-4xl font-bold text-white mb-6'>
									${listing.price.toLocaleString()}
								</p>
								{listing.status === "sold" ? (
									<h2 className='text-red-400 text-3xl font-black'>
										Out Of Stock
									</h2>
								) : (
									<div className='space-y-3'>
										<Button
											onClick={() =>
												handleContactSeller(
													listing.seller.phone
												)
											}
											className='w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white gap-2 '>
											<MessageCircle size={18} />
											Contact on WhatsApp
										</Button>

										<div className='flex gap-2'>
											<Button
												variant='outline'
												size='icon'
												onClick={() =>
													handleContactSeller(
														"917755089819"
													)
												}
												className='flex-1 cursor-pointer border-white/30 text-shadow-gray-600 hover:bg-white/20'>
												<MessageCircle size={20} />
												Admin
											</Button>
											<Button
												variant='outline'
												onClick={() => {
													try {
														navigator.clipboard.writeText(
															window.location.href
														);
														toast.success(
															"Link copied to clipboard"
														);
													} catch (error) {
														console.error(
															"Failed to copy link:",
															error
														);
														toast.error(
															"Failed to copy link"
														);
													}
												}}
												size='icon'
												className='flex-1 cursor-pointer border-white/30 text-gray-600 hover:bg-white/20'>
												<Share2 size={20} />
												Share
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* recent bids  */}
						{listing.bids.length > 0 && (
							<Card className='bg-white border-gray-200 shadow-sm'>
								<CardHeader>
									<CardTitle className='text-gray-900 text-lg flex items-center gap-2'>
										<TrendingDown
											size={20}
											className='text-cyan-500'
										/>
										Recent Bids
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-3 max-h-96 overflow-y-auto'>
										{listing.bids.map((bid: any) => (
											<div
												key={bid._id}
												className='p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors'>
												<div className='flex items-start justify-between mb-2'>
													<div className='flex-1'>
														<p className='font-semibold text-gray-900 text-sm'>
															{bid.bidder?.name ||
																"Anonymous"}
														</p>
														<p className='font-light flex items-center gap-1 text-gray-900 text-sm'>
															{bid.bidder
																?.phone ||
																"Unknown"}
															<Copy
																size={16}
																className='cursor-pointer'
																onClick={() => {
																	navigator.clipboard.writeText(
																		bid
																			.bidder
																			?.phone ||
																			""
																	);
																	toast.success(
																		"Phone number copied to clipboard"
																	);
																}}
															/>
														</p>
														<p className='text-xs text-gray-600'>
															{new Date(
																bid.createdAt
															).toLocaleDateString()}{" "}
															{new Date(
																bid.createdAt
															).toLocaleTimeString(
																[],
																{
																	hour: "2-digit",
																	minute: "2-digit",
																}
															)}
														</p>
													</div>
													<div className='text-right'>
														<p className='font-bold text-cyan-400'>
															$
															{bid.amount.toLocaleString()}
														</p>
														<p className='text-xs text-gray-600'>
															{bid.amount >
															listing.price
																? `+$${(
																		bid.amount -
																		listing.price
																  ).toLocaleString()}`
																: "Offer"}
														</p>
													</div>
												</div>
												{bid.message && (
													<p className='text-xs text-gray-600 italic border-t border-gray-200 pt-2 mt-2'>
														"{bid.message}"
													</p>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Bidding Card */}
						{listing.allowBidding && (
							<Card className='bg-white border-gray-200 shadow-sm'>
								<CardHeader>
									<CardTitle className='text-gray-900'>
										Place a Bid
									</CardTitle>
								</CardHeader>
								<CardContent>
									<form
										onSubmit={handlePlaceBid}
										className='space-y-4'>
										<div>
											<Label
												htmlFor='bidAmount'
												className='text-gray-700'>
												Bid Amount (USD)
											</Label>
											<Input
												id='bidAmount'
												type='number'
												min={listing.minBidAmount}
												value={bidAmount}
												onChange={(e) =>
													setBidAmount(e.target.value)
												}
												className='mt-2 bg-white border-gray-300 text-gray-900'
												required
											/>
											<p className='text-xs text-gray-600 mt-1'>
												Minimum: $
												{listing.minBidAmount.toLocaleString()}
											</p>
										</div>

										<div>
											<Label
												htmlFor='bidMessage'
												className='text-gray-700'>
												Message (Optional)
											</Label>
											<textarea
												id='bidMessage'
												value={bidMessage}
												onChange={(e) =>
													setBidMessage(
														e.target.value
													)
												}
												placeholder="Tell the seller why you're interested..."
												className='mt-2 w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md text-sm placeholder:text-gray-400'
												rows={3}
											/>
										</div>

										<Button
											type='submit'
											disabled={
												listing.status === "sold" ||
												submittingBid
											}
											className='w-full bg-linear-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white cursor-pointer'>
											{submittingBid
												? "Placing Bid..."
												: `${
														listing.status ===
														"sold"
															? "Bidding Closed"
															: "Place Bid"
												  }`}
										</Button>
									</form>
								</CardContent>
							</Card>
						)}

						{/* Seller Info */}
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900'>
									Seller Information
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center gap-3'>
									<Image
										className='rounded-full'
										src={
											listing.seller.avatar || "/user.jpg"
										}
										width={50}
										height={50}
										alt='Profile'
									/>
									<div>
										<p className='font-semibold flex gap-1 text-gray-900'>
											{listing.seller?.name}{" "}
											{listing.seller?.verified ? (
												<Verified
													color='white'
													fill='green'
												/>
											) : (
												""
											)}
											{listing.seller?.role ===
												"admin" && (
												<span className='text-xs mt-2 italic text-blue-600 font-light'>
													(Admin)
												</span>
											)}
										</p>
										<div className='flex items-center gap-1'>
											<Star
												size={14}
												className='text-yellow-500'
												fill='currentColor'
											/>
											<span className='text-sm text-gray-600'>
												{listing.seller?.rating || 0}{" "}
												rating
											</span>
										</div>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-3 pt-4 border-t border-gray-200'>
									<div>
										<p className='text-xs text-gray-600'>
											Sales
										</p>
										<p className='font-bold text-gray-900'>
											${listing.seller?.totalSales || 0}
										</p>
									</div>
									<div>
										<p className='text-xs text-gray-600'>
											Listings
										</p>
										<p className='font-bold text-gray-900'>
											{listing.seller?.listings.length ||
												0}
										</p>
									</div>
								</div>
								<Link href={`/profile/${listing.seller?._id}`}>
									<Button
										variant='outline'
										className='w-full border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer'>
										View Profile
									</Button>
								</Link>
							</CardContent>
						</Card>

						{/* Stats */}
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardContent className='p-6 space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-gray-600 flex items-center gap-2'>
										<TrendingUp size={16} />
										Views
									</span>
									<span className='font-bold text-gray-900'>
										{listing.views}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-gray-600 flex items-center gap-2'>
										<Calendar size={16} />
										Listed
									</span>
									<span className='font-bold text-gray-900'>
										{new Date(
											listing.createdAt
										).toLocaleDateString()}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
