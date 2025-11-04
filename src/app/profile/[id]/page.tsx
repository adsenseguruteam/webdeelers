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
			<div className='flex items-center text-gray-900 justify-center min-h-screen bg-gray-50'>
				<Loader2 className='h-12 w-12 animate-spin' />
			</div>
		);
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900 mb-4'>
						Profile Not Found
					</h1>
					<Link href='/marketplace'>
						<Button className='bg-linear-to-br from-blue-500 to-cyan-500 text-white'>
							Back to Marketplace
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-6xl mx-auto px-4'>
				{/* Profile Header */}
				<Card className='bg-white border-gray-200 mb-8 shadow-sm'>
					<CardContent className='pt-8'>
						<div className='flex flex-col md:flex-row gap-8 items-start md:items-center'>
							{/* Avatar */}
							<div className='w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center'>
								<span className='text-4xl font-bold text-white'>
									{user.name.charAt(0).toUpperCase()}
								</span>
							</div>

							{/* User Info */}
							<div className='flex-1'>
								<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
									<div>
										<h1 className='text-3xl font-bold text-gray-900 mb-2'>
											{user.name}
										</h1>
										<p className='text-gray-600 mb-2'>
											{user.email}
										</p>
										{user.bio && (
											<p className='text-gray-700 mb-4'>
												{user.bio}
											</p>
										)}

										{/* Rating */}
										<div className='flex items-center gap-2 mb-4'>
											<div className='flex items-center gap-1'>
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														size={16}
														className={
															i <
															Math.floor(
																user.rating
															)
																? "fill-yellow-400 text-yellow-400"
																: "text-gray-400"
														}
													/>
												))}
											</div>
											<span className='text-gray-600'>
												({user.rating.toFixed(1)})
											</span>
										</div>

										{/* Verification Badge */}
										{user.verified && (
											<div className='inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm font-medium'>
												✓ Verified Seller
											</div>
										)}
										{user.role === "admin" && (
											<div className='inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm font-medium'>
												✓ Admin
											</div>
										)}
									</div>

									{/* Contact Buttons */}
									<div className='flex flex-col gap-2 w-full md:w-auto'>
										<a href={`mailto:${user.email}`}>
											<Button className='w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white'>
												<Mail
													size={18}
													className='mr-2'
												/>
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
												rel='noopener noreferrer'>
												<Button className='w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white'>
													<MessageCircle
														size={18}
														className='mr-2'
													/>
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
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-600 text-sm mb-1'>
										Total Listings
									</p>
									<p className='text-3xl font-bold text-gray-900'>
										{user.listings.length}
									</p>
								</div>
								<ShoppingBag
									size={32}
									className='text-blue-500 opacity-50'
								/>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-600 text-sm mb-1'>
										Sold
									</p>
									<p className='text-3xl font-bold text-gray-900'>
										{
											listings.filter(
												(l: any) => l.status === "sold"
											).length
										}
									</p>
								</div>
								<TrendingUp
									size={32}
									className='text-green-500 opacity-50'
								/>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-600 text-sm mb-1'>
										Active
									</p>
									<p className='text-3xl font-bold text-gray-900'>
										{
											listings.filter(
												(l: any) =>
													l.status === "active"
											).length
										}
									</p>
								</div>
								<ShoppingBag
									size={32}
									className='text-cyan-500 opacity-50'
								/>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-600 text-sm mb-1'>
										Total Sales
									</p>
									<p className='text-3xl font-bold text-gray-900'>
										${user.totalSales.toLocaleString()}
									</p>
								</div>
								<DollarSign
									size={32}
									className='text-yellow-500 opacity-50'
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Listings Section */}
				<div>
					<h2 className='text-2xl font-bold text-gray-900 mb-6'>
						Active Listings 0
					</h2>
					{listings.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{listings.map((listing: any) => (
								<Link
									key={listing._id}
									href={`/listing/${listing._id}`}>
									<Card className='bg-white border-gray-200 hover:border-blue-500 transition-colors cursor-pointer h-full shadow-sm'>
										{listing.thumbnail && (
											<div className='w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden'>
												<img
													src={
														listing.thumbnail ||
														"/placeholder.svg"
													}
													alt={listing.title}
													className='w-full h-full object-cover'
												/>
											</div>
										)}
										<CardContent className='pt-4'>
											<h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
												{listing.title}
											</h3>
											<p className='text-gray-600 text-sm mb-3'>
												{listing.category}
											</p>
											<div className='flex justify-between items-center'>
												<span className='text-xl font-bold text-cyan-400'>
													$
													{listing.price.toLocaleString()}
												</span>
												<span className='text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded'>
													{listing.status}
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardContent className='pt-8 text-center'>
								<p className='text-gray-600'>
									No active listings
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
