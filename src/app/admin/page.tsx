"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CheckCircle,
	XCircle,
	Clock,
	Users,
	FileText,
	TrendingUp,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { toast } from "sonner";

export default function AdminPanel() {
	const { user } = userContext();
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("pending");
	const [stats, setStats] = useState({
		totalListings: 0,
		totalUsers: 0,
		pendingListings: 0,
		totalBids: 0,
	});

	const fetchData = async () => {
		try {
			if (!user) {
				return;
			}
			const response = await axios.get(
				`/api/admin/all-listings?adminId=${user?._id}`
			);
			setListings(response.data);

			// Calculate stats
			setStats({
				totalListings: response.data.length,
				totalUsers: 0,
				pendingListings: response.data.filter(
					(l: any) => l.status === "pending"
				).length,
				totalBids: 0,
			});
		} catch (error) {
			console.error("Failed to fetch listings:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, [user]);

	const handleStatusUpdate = async (listingId: string, status: string) => {
		try {
			if (!user) {
				return;
			}
			const response = await axios.put("/api/admin/all-listings", {
				listingId,
				action: status,
				adminId: user?._id,
			});

			if (response.data.success) {
				await fetchData();
				toast.success("Listing status updated successfully");
			} else {
				toast.error("Failed to update listing status");
			}
		} catch (error) {
			console.error("Failed to update listing status:", error);
			toast.error("Failed to update listing status");
		}
	};

	const filteredListings = listings.filter((l: any) => l.status === filter);

	return (
		<div className='flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
			<AdminSidebar />

			{/* Main Content */}
			<main className='flex-1 md:ml-64 p-4 md:p-8'>
				{/* Header */}
				<div className='mb-8 mt-12 md:mt-0'>
					<h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
						Admin Dashboard
					</h1>
					<p className='text-slate-400'>
						Manage marketplace listings and users
					</p>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-slate-400 text-sm'>
										Total Listings
									</p>
									<p className='text-3xl font-bold text-white mt-2'>
										{stats.totalListings}
									</p>
								</div>
								<FileText size={32} className='text-blue-500' />
							</div>
						</CardContent>
					</Card>

					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-slate-400 text-sm'>
										Pending Review
									</p>
									<p className='text-3xl font-bold text-yellow-500 mt-2'>
										{stats.pendingListings}
									</p>
								</div>
								<Clock size={32} className='text-yellow-500' />
							</div>
						</CardContent>
					</Card>

					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-slate-400 text-sm'>
										Total Users
									</p>
									<p className='text-3xl font-bold text-white mt-2'>
										{stats.totalUsers}
									</p>
								</div>
								<Users size={32} className='text-cyan-500' />
							</div>
						</CardContent>
					</Card>

					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-slate-400 text-sm'>
										Active Bids
									</p>
									<p className='text-3xl font-bold text-white mt-2'>
										{stats.totalBids}
									</p>
								</div>
								<TrendingUp
									size={32}
									className='text-green-500'
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filter Tabs */}
				<div className='flex gap-2 mb-6 overflow-x-auto'>
					{["pending", "active", "rejected"].map((status: string) => (
						<Button
							key={status}
							onClick={() => setFilter(status)}
							variant={filter === status ? "default" : "outline"}
							className={
								filter === status
									? "bg-linear-to-r from-blue-500 cursor-pointer to-cyan-500"
									: "border-slate-600 cursor-pointer text-slate-500 hover:text-slate-300 hover:bg-slate-700"
							}>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</Button>
					))}
				</div>

				{/* Listings Grid */}
				<div className='grid grid-cols-1 gap-6'>
					{loading ? (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<p className='text-slate-400'>Loading...</p>
							</CardContent>
						</Card>
					) : filteredListings.length > 0 ? (
						filteredListings.map((listing: any) => (
							<Card
								key={listing._id}
								className='bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors'>
								<CardContent className='p-6'>
									<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
										<div className='flex-1'>
											<h3 className='text-xl font-bold text-white mb-2'>
												{listing.title}
											</h3>
											<p className='text-slate-400 mb-3 line-clamp-2'>
												{listing.description}
											</p>

											<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
												<div>
													<p className='text-xs text-slate-500'>
														Category
													</p>
													<p className='text-sm font-semibold text-white'>
														{listing.category}
													</p>
												</div>
												<div>
													<p className='text-xs text-slate-500'>
														Price
													</p>
													<p className='text-sm font-semibold text-white'>
														$
														{listing.price.toLocaleString()}
													</p>
												</div>
												<div>
													<p className='text-xs text-slate-500'>
														Seller
													</p>
													<p className='text-sm font-semibold text-white'>
														{listing.seller?.name}
													</p>
												</div>
												<div>
													<p className='text-xs text-slate-500'>
														Status
													</p>
													<div className='flex items-center gap-1 mt-1'>
														<Clock
															size={14}
															className='text-yellow-500'
														/>
														<p className='text-sm font-semibold text-yellow-500'>
															{listing.status}
														</p>
													</div>
												</div>
											</div>

											{listing.metrics && (
												<div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-slate-700 rounded-lg'>
													{listing.metrics
														.monthlyRevenue && (
														<div>
															<p className='text-xs text-slate-400'>
																Monthly Revenue
															</p>
															<p className='text-sm font-semibold text-white'>
																$
																{listing.metrics.monthlyRevenue.toLocaleString()}
															</p>
														</div>
													)}
													{listing.metrics
														.monthlyTraffic && (
														<div>
															<p className='text-xs text-slate-400'>
																Monthly Traffic
															</p>
															<p className='text-sm font-semibold text-white'>
																{listing.metrics.monthlyTraffic.toLocaleString()}
															</p>
														</div>
													)}
													{listing.metrics
														.followers && (
														<div>
															<p className='text-xs text-slate-400'>
																Followers
															</p>
															<p className='text-sm font-semibold text-white'>
																{listing.metrics.followers.toLocaleString()}
															</p>
														</div>
													)}
													{listing.metrics.age && (
														<div>
															<p className='text-xs text-slate-400'>
																Age
															</p>
															<p className='text-sm font-semibold text-white'>
																{
																	listing
																		.metrics
																		.age
																}{" "}
																months
															</p>
														</div>
													)}
												</div>
											)}
										</div>

										{/* Action Buttons */}
										{listing.status === "pending" && (
											<div className='flex gap-2 w-full md:w-auto'>
												<Button
													onClick={() =>
														handleStatusUpdate(
															listing._id,
															"active"
														)
													}
													className='flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white gap-2'>
													<CheckCircle size={18} />
													Approve
												</Button>
												<Button
													onClick={() =>
														handleStatusUpdate(
															listing._id,
															"rejected"
														)
													}
													className='flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white gap-2'>
													<XCircle size={18} />
													Reject
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<p className='text-slate-400'>
									No listings to review
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</main>
		</div>
	);
}
