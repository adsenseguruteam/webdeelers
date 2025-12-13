"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Mail,
	MessageCircle,
	Star,
	TrendingUp,
	ShoppingBag,
	DollarSign,
	Loader2,
	CheckCircle,
	Shield,
	FileText,
	Eye,
	Calendar,
	MapPin,
	Phone,
	User,
	AlertCircle,
} from "lucide-react";

export default function ProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [user, setUser] = useState<any>(null);
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await fetch(`/api/users/${id}`);
				if (!response.ok) throw new Error("User not found");
				const userData = await response.json();
				setUser(userData);
				setListings(userData.listings);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, [id]);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
				<Loader2 className='h-12 w-12 animate-spin text-sky-600' />
			</div>
		);
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4'>
				<Card className='bg-white border border-slate-200 shadow-lg max-w-md w-full'>
					<CardContent className='p-8 text-center'>
						<AlertCircle className='h-16 w-16 text-slate-400 mx-auto mb-4' />
						<h1 className='text-2xl font-bold text-slate-900 mb-2'>
							Profile Not Found
						</h1>
						<p className='text-slate-600 mb-6'>
							The user profile you're looking for doesn't exist.
						</p>
						<Link href='/marketplace'>
							<Button className='bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white'>
								Back to Marketplace
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	const activeListings = listings.filter(
		(l: any) => l.status === "active"
	).length;
	const soldListings = listings.filter(
		(l: any) => l.status === "sold"
	).length;
	const pendingListings = listings.filter(
		(l: any) => l.status === "pending"
	).length;

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-6 md:py-8'>
			<div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
				{/* Profile Header */}
				<Card className='bg-white border p-0 border-slate-200 mb-6 md:mb-8 shadow-lg overflow-hidden'>
					<div className='h-24 md:h-32 bg-linear-to-r from-sky-500 via-blue-500 to-cyan-500' />
					<CardContent className='pt-0 pb-6 md:pb-8 px-4 md:px-8'>
						<div className='flex flex-col md:flex-row gap-6 -mt-12 md:-mt-16'>
							{/* Avatar */}
							<div className='relative'>
								<div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-sky-400 to-blue-500 flex items-center justify-center border-4 border-white shadow-xl'>
									<span className='text-3xl md:text-4xl font-bold text-white'>
										{user.name?.charAt(0).toUpperCase() ||
											"U"}
									</span>
								</div>
								{user.verified && (
									<div className='absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg'>
										<CheckCircle
											size={16}
											className='text-white'
										/>
									</div>
								)}
							</div>

							{/* User Info */}
							<div className='flex-1 pt-2 md:pt-4'>
								<div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
									<div className='flex-1'>
										<div className='flex items-center gap-3 mb-2 flex-wrap'>
											<h1 className='text-2xl md:text-3xl font-bold text-slate-900'>
												{user.name || "Unknown User"}
											</h1>
											{user.verified && (
												<span className='inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200'>
													<CheckCircle size={14} />
													Verified
												</span>
											)}
											{user.role === "admin" && (
												<span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200'>
													<Shield size={14} />
													Admin
												</span>
											)}
										</div>

										{user.bio && (
											<p className='text-slate-600 mb-4 text-sm md:text-base leading-relaxed'>
												{user.bio}
											</p>
										)}

										{/* Contact Info */}
										<div className='flex flex-col sm:flex-row gap-4 mb-4'>
											{user.email && (
												<div className='flex items-center gap-2 text-slate-600 text-sm'>
													<Mail
														size={16}
														className='text-slate-400'
													/>
													<span className='break-all'>
														{user.email}
													</span>
												</div>
											)}
											{user.phone && (
												<div className='flex items-center gap-2 text-slate-600 text-sm'>
													<Phone
														size={16}
														className='text-slate-400'
													/>
													<span>{user.phone}</span>
												</div>
											)}
										</div>

										{/* Rating */}
										<div className='flex items-center gap-2 mb-4'>
											<div className='flex items-center gap-1'>
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														size={18}
														className={
															i <
															Math.floor(
																user.rating || 0
															)
																? "fill-amber-400 text-amber-400"
																: "text-slate-300"
														}
													/>
												))}
											</div>
											<span className='text-slate-600 font-semibold'>
												{(user.rating || 0).toFixed(1)}
											</span>
										</div>
									</div>

									{/* Contact Buttons */}
									<div className='flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-auto'>
										<a
											href={`mailto:${user.email}`}
											className='w-full sm:w-auto'>
											<Button className='w-full cursor-pointer bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white gap-2 shadow-lg shadow-sky-500/20'>
												<Mail size={18} />
												Email
											</Button>
										</a>
										{user.phone && (
											<a
												href={`https://wa.me/${user.phone.replace(
													/\D/g,
													""
												)}`}
												target='_blank'
												rel='noopener noreferrer'
												className='w-full sm:w-auto'>
												<Button className='w-full cursor-pointer bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20'>
													<MessageCircle size={18} />
													WhatsApp
												</Button>
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats Grid */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8'>
					<Card className='bg-linear-to-br from-white to-blue-50/30 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Total Listings
									</p>
									<p className='text-2xl md:text-3xl font-bold text-slate-900'>
										{user.listings?.length || 0}
									</p>
								</div>
								<div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20'>
									<ShoppingBag
										size={20}
										className='text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Sold
									</p>
									<p className='text-2xl md:text-3xl font-bold text-emerald-600'>
										{soldListings}
									</p>
								</div>
								<div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20'>
									<TrendingUp
										size={20}
										className='text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-cyan-50/30 border border-cyan-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Active
									</p>
									<p className='text-2xl md:text-3xl font-bold text-cyan-600'>
										{activeListings}
									</p>
								</div>
								<div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
									<CheckCircle
										size={20}
										className='text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-amber-50/30 border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Total Sales
									</p>
									<p className='text-xl md:text-2xl font-bold text-amber-600 truncate'>
										$
										{(
											user.totalSales || 0
										).toLocaleString()}
									</p>
								</div>
								<div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20'>
									<DollarSign
										size={20}
										className='text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Listings Section */}
				<div>
					<div className='flex items-center justify-between mb-4 md:mb-6'>
						<h2 className='text-2xl md:text-3xl font-bold text-slate-900'>
							Active Listings
						</h2>
						<span className='px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold'>
							{listings.length}
						</span>
					</div>
					{listings.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
							{listings.map((listing: any) => (
								<Link
									key={listing._id}
									href={`/listing/${
										listing.slug || listing._id
									}`}>
									<Card className='bg-white p-0 border border-slate-200 hover:border-sky-500 transition-all duration-300 cursor-pointer h-full shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden group'>
										{listing.thumbnail && (
											<div className='relative w-full h-48 bg-slate-100 overflow-hidden'>
												<img
													src={
														listing.thumbnail ||
														"/placeholder.svg"
													}
													alt={listing.title}
													className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
												/>
												<div className='absolute top-2 right-2'>
													<span
														className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
															listing.status ===
															"sold"
																? "bg-rose-500/90 text-white"
																: listing.status ===
																  "active"
																? "bg-emerald-500/90 text-white"
																: "bg-amber-500/90 text-white"
														}`}>
														{listing.status}
													</span>
												</div>
											</div>
										)}
										<CardContent className='p-4 md:p-6'>
											<h3 className='font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors text-base md:text-lg'>
												{listing.title}
											</h3>
											<p className='text-slate-600 text-sm mb-3'>
												{listing.category}
											</p>
											<div className='flex justify-between items-center pt-3 border-t border-slate-200'>
												<div className='flex items-baseline gap-1'>
													<DollarSign
														size={18}
														className='text-emerald-600'
													/>
													<span className='text-xl md:text-2xl font-bold text-emerald-600'>
														{listing.price?.toLocaleString() ||
															"0"}
													</span>
												</div>
												<div className='flex items-center gap-1 text-xs text-slate-500'>
													<Eye size={14} />
													<span>
														{listing.views || 0}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<Card className='bg-white border border-slate-200 shadow-lg'>
							<CardContent className='p-12 md:p-16 text-center'>
								<FileText className='h-16 w-16 text-slate-300 mx-auto mb-4' />
								<p className='text-slate-600 text-lg font-medium mb-2'>
									No listings available
								</p>
								<p className='text-slate-500 text-sm'>
									This user hasn't created any listings yet.
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
