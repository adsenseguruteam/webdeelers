"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	CheckCircle,
	XCircle,
	Clock,
	Users,
	FileText,
	TrendingUp,
	Search,
	Filter,
	Loader2,
	AlertCircle,
	Calendar,
	DollarSign,
	Eye,
	List,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { toast } from "sonner";

export default function AdminPanel() {
	const { user } = userContext();
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [stats, setStats] = useState({
		totalListings: 0,
		totalUsers: 0,
		pendingListings: 0,
		activeListings: 0,
		rejectedListings: 0,
	});

	const fetchData = async () => {
		try {
			if (!user) {
				return;
			}
			// Fetch listings and users in parallel
			const [listingsResponse, usersResponse] = await Promise.all([
				axios.get(`/api/admin/all-listings?adminId=${user?._id}`),
				axios.get(`/api/admin/users?adminId=${user?._id}`),
			]);

			setListings(listingsResponse.data);
			const allUsers = usersResponse.data || [];

			// Calculate stats
			const allListings = listingsResponse.data;
			setStats({
				totalListings: allListings.length,
				totalUsers: allUsers.length,
				pendingListings: allListings.filter(
					(l: any) => l.status === "pending"
				).length,
				activeListings: allListings.filter(
					(l: any) => l.status === "active"
				).length,
				rejectedListings: allListings.filter(
					(l: any) => l.status === "rejected"
				).length,
			});
		} catch (error) {
			console.error("Failed to fetch data:", error);
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

	const filteredListings = listings.filter((l: any) => {
		const matchesStatus = filter === "all" || l.status === filter;
		const matchesSearch =
			searchQuery === "" ||
			l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			l.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			l.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			all: {
				bg: "bg-slate-100 text-slate-700 border-slate-200",
				icon: List,
				iconColor: "text-slate-600",
			},
			pending: {
				bg: "bg-amber-100 text-amber-700 border-amber-200",
				icon: Clock,
				iconColor: "text-amber-600",
			},
			active: {
				bg: "bg-emerald-100 text-emerald-700 border-emerald-200",
				icon: CheckCircle,
				iconColor: "text-emerald-600",
			},
			rejected: {
				bg: "bg-rose-100 text-rose-700 border-rose-200",
				icon: XCircle,
				iconColor: "text-rose-600",
			},
		};
		return (
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.all
		);
	};

	return (
		<div className='flex min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
			<AdminSidebar />

			{/* Main Content */}
			<main className='flex-1 md:ml-64 p-4 md:p-6 lg:p-8'>
				{/* Header */}
				<div className='mb-8 mt-16 md:mt-0'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
						<div>
							<h1 className='text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2'>
								Admin Dashboard
							</h1>
							<p className='text-slate-600 text-sm md:text-base'>
								Manage marketplace listings and users
							</p>
						</div>

						{/* Search Bar */}
						<div className='relative w-full md:w-80'>
							<Search
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
								size={20}
							/>
							<Input
								type='text'
								placeholder='Search listings...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10 pr-4 h-11 bg-white border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 shadow-sm'
							/>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8'>
					<Card className='bg-linear-to-br from-white to-blue-50/30 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-slate-600 text-sm font-medium mb-1'>
										Total Listings
									</p>
									<p className='text-3xl font-bold text-slate-900 mb-1'>
										{stats.totalListings}
									</p>
									<div className='flex items-center gap-1 text-xs text-slate-500'>
										<FileText size={12} />
										<span>All listings</span>
									</div>
								</div>
								<div className='w-14 h-14 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20'>
									<FileText
										size={24}
										className='text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-amber-50/30 border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-slate-600 text-sm font-medium mb-1'>
										Pending Review
									</p>
									<p className='text-3xl font-bold text-amber-600 mb-1'>
										{stats.pendingListings}
									</p>
									<div className='flex items-center gap-1 text-xs text-slate-500'>
										<Clock size={12} />
										<span>Awaiting action</span>
									</div>
								</div>
								<div className='w-14 h-14 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20'>
									<Clock size={24} className='text-white' />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-slate-600 text-sm font-medium mb-1'>
										Active Listings
									</p>
									<p className='text-3xl font-bold text-emerald-600 mb-1'>
										{stats.activeListings}
									</p>
									<div className='flex items-center gap-1 text-xs text-slate-500'>
										<CheckCircle size={12} />
										<span>Published</span>
									</div>
								</div>
								<div className='w-14 h-14 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20'>
									<CheckCircle
										size={24}
										className='text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-cyan-50/30 border border-cyan-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-slate-600 text-sm font-medium mb-1'>
										Total Users
									</p>
									<p className='text-3xl font-bold text-slate-900 mb-1'>
										{stats.totalUsers}
									</p>
									<div className='flex items-center gap-1 text-xs text-slate-500'>
										<Users size={12} />
										<span>Registered</span>
									</div>
								</div>
								<div className='w-14 h-14 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
									<Users size={24} className='text-white' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filter Tabs */}
				<div className='flex items-center gap-3 mb-6 overflow-x-auto pb-2'>
					<div className='flex items-center gap-2 text-slate-600 text-sm font-medium'>
						<Filter size={18} />
						<span>Filter:</span>
					</div>
					{["all", "pending", "active", "rejected"].map(
						(status: string) => {
							const statusConfig = getStatusBadge(status);
							const StatusIcon = statusConfig.icon;
							const count =
								status === "all"
									? listings.length
									: listings.filter(
											(l: any) => l.status === status
									  ).length;
							return (
								<Button
									key={status}
									onClick={() => setFilter(status)}
									variant='ghost'
									className={`relative cursor-pointer transition-all duration-200 gap-2 h-10 px-4 ${
										filter === status
											? "bg-linear-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/30 hover:from-sky-600 hover:to-blue-600"
											: "border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
									}`}>
									<StatusIcon
										size={16}
										className={
											filter === status
												? "text-white"
												: statusConfig.iconColor
										}
									/>
									<span className='font-medium'>
										{status.charAt(0).toUpperCase() +
											status.slice(1)}
									</span>
									{filter === status && (
										<span className='ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold'>
											{count}
										</span>
									)}
								</Button>
							);
						}
					)}
				</div>

				{/* Listings Grid */}
				<div className='grid grid-cols-1 gap-4 md:gap-6'>
					{loading ? (
						<Card className='bg-white border border-slate-200 shadow-lg'>
							<CardContent className='p-16 text-center'>
								<Loader2
									className='animate-spin mx-auto mb-4 text-sky-500'
									size={32}
								/>
								<p className='text-slate-600 font-medium'>
									Loading listings...
								</p>
							</CardContent>
						</Card>
					) : filteredListings.length > 0 ? (
						filteredListings.map((listing: any) => {
							const statusConfig = getStatusBadge(listing.status);
							const StatusIcon = statusConfig.icon;
							return (
								<Card
									key={listing._id}
									className='bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group'>
									<CardContent className='p-6'>
										<div className='flex flex-col lg:flex-row justify-between items-start gap-6'>
											<div className='flex-1 w-full'>
												{/* Header Section */}
												<div className='flex items-start justify-between mb-4'>
													<div className='flex-1'>
														<h3 className='text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors'>
															{listing.title}
														</h3>
														<p className='text-slate-600 mb-4 line-clamp-2 text-sm md:text-base'>
															{
																listing.description
															}
														</p>
													</div>
													{/* Status Badge */}
													<div
														className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bg} shadow-sm ml-4`}>
														<StatusIcon
															size={14}
															className={
																statusConfig.iconColor
															}
														/>
														<span className='text-xs font-semibold capitalize'>
															{listing.status}
														</span>
													</div>
												</div>

												{/* Key Info Grid */}
												<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
													<div className='bg-slate-50 rounded-lg p-3 border border-slate-100'>
														<p className='text-xs text-slate-500 mb-1 font-medium'>
															Category
														</p>
														<p className='text-sm font-bold text-slate-900'>
															{listing.category ||
																"N/A"}
														</p>
													</div>
													<div className='bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-3 border border-emerald-100'>
														<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
															<DollarSign
																size={12}
															/>
															Price
														</p>
														<p className='text-sm font-bold text-emerald-700'>
															$
															{listing.price?.toLocaleString() ||
																"0"}
														</p>
													</div>
													<div className='bg-slate-50 rounded-lg p-3 border border-slate-100'>
														<p className='text-xs text-slate-500 mb-1 font-medium'>
															Seller
														</p>
														<p className='text-sm font-bold text-slate-900 truncate'>
															{listing.seller
																?.name ||
																"Unknown"}
														</p>
													</div>
													<div className='bg-slate-50 rounded-lg p-3 border border-slate-100'>
														<p className='text-xs text-slate-500 mb-1 font-medium flex items-center gap-1'>
															<Calendar
																size={12}
															/>
															Created
														</p>
														<p className='text-sm font-bold text-slate-900'>
															{listing.createdAt
																? new Date(
																		listing.createdAt
																  ).toLocaleDateString()
																: "N/A"}
														</p>
													</div>
												</div>

												{/* Metrics Section */}
												{listing.metrics && (
													<div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-linear-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200 shadow-sm'>
														{listing.metrics
															.monthlyRevenue && (
															<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
																<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
																	<TrendingUp
																		size={
																			12
																		}
																		className='text-emerald-600'
																	/>
																	Monthly
																	Revenue
																</p>
																<p className='text-sm font-bold text-slate-900'>
																	$
																	{listing.metrics.monthlyRevenue.toLocaleString()}
																</p>
															</div>
														)}
														{listing.metrics
															.monthlyTraffic && (
															<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
																<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
																	<Eye
																		size={
																			12
																		}
																		className='text-blue-600'
																	/>
																	Monthly
																	Traffic
																</p>
																<p className='text-sm font-bold text-slate-900'>
																	{listing.metrics.monthlyTraffic.toLocaleString()}
																</p>
															</div>
														)}
														{listing.metrics
															.followers && (
															<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
																<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
																	<Users
																		size={
																			12
																		}
																		className='text-purple-600'
																	/>
																	Followers
																</p>
																<p className='text-sm font-bold text-slate-900'>
																	{listing.metrics.followers.toLocaleString()}
																</p>
															</div>
														)}
														{listing.metrics
															.age && (
															<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
																<p className='text-xs text-slate-600 mb-1 font-medium'>
																	Age
																</p>
																<p className='text-sm font-bold text-slate-900'>
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
												<div className='flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:min-w-[200px]'>
													<Button
														onClick={() =>
															handleStatusUpdate(
																listing._id,
																"active"
															)
														}
														className='flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-200 h-11 font-medium'>
														<CheckCircle
															size={18}
														/>
														<span>Approve</span>
													</Button>
													<Button
														onClick={() =>
															handleStatusUpdate(
																listing._id,
																"rejected"
															)
														}
														className='flex-1 bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white gap-2 shadow-lg shadow-rose-500/20 transition-all duration-200 h-11 font-medium'>
														<XCircle size={18} />
														<span>Reject</span>
													</Button>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							);
						})
					) : (
						<Card className='bg-white border border-slate-200 shadow-lg'>
							<CardContent className='p-16 text-center'>
								<AlertCircle
									className='mx-auto mb-4 text-slate-400'
									size={48}
								/>
								<p className='text-slate-600 font-medium text-lg mb-2'>
									{searchQuery
										? "No listings found"
										: "No listings to review"}
								</p>
								{searchQuery && (
									<p className='text-slate-500 text-sm'>
										Try adjusting your search or filter
										criteria
									</p>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</main>
		</div>
	);
}
