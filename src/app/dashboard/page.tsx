"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Plus,
	Eye,
	DollarSign,
	TrendingUp,
	BookOpen,
	Trash2,
	Edit2,
	EyeIcon,
	ChevronDown,
	Loader2,
	User,
	FileText,
	CheckCircle,
	XCircle,
	Clock,
	ShoppingBag,
	Search,
	Filter,
	AlertCircle,
	Calendar,
	Users,
	MapPin,
	Link as LinkIcon,
	X,
	Star,
	ArrowUpRight,
} from "lucide-react";
import { userContext } from "@/context/userContext";
import { toast } from "sonner";

export default function Dashboard() {
	const { user } = userContext();
	const [profile, setProfile] = useState<any>();
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedListing, setSelectedListing] = useState<any>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [deleting, setDeleting] = useState<any>(null);
	const [updating, setUpdating] = useState<any>(null);

	const fetchDashboardData = async () => {
		try {
			if (!user) return;

			const response = await fetch(`/api/users/${user?._id}`);
			if (!response.ok) throw new Error("User not found");
			const userData = await response.json();
			setProfile(userData);

			setListings(userData.listings || []);
		} catch (error) {
			console.error("Failed to fetch dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDashboardData();
	}, [user]);

	const handleDeleteListing = async (listingId: string) => {
		if (!window.confirm("Are you sure you want to delete this listing?"))
			return;

		setDeleting(listingId);
		try {
			if (!user) return;
			const response = await fetch(`/api/listings/${listingId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user?._id }),
			});

			if (response.ok) {
				setListings(listings.filter((l: any) => l._id !== listingId));
				toast.success("Listing deleted successfully");
			} else {
				toast.error("Failed to delete listing");
			}
		} catch (error) {
			console.error("Delete error:", error);
			alert("Error deleting listing");
		} finally {
			setDeleting(null);
		}
	};

	const handleUpdateStatus = async (listingId: string, newStatus: string) => {
		setUpdating(listingId);
		try {
			if (!user) return;
			if (newStatus === "active") {
				toast.success(
					"You cant make this listing active, contact support for more details"
				);
				return;
			}

			const response = await fetch(`/api/listings/${listingId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user?._id, status: newStatus }),
			});

			if (response.ok) {
				await response.json();
				toast.success("Status updated successfully");
				await fetchDashboardData();
			} else {
				toast.error("Failed to update status");
			}
		} catch (error) {
			console.error("Update error:", error);
			toast.error("Error updating status");
		} finally {
			setUpdating(null);
		}
	};

	const getStatusConfig = (status: string) => {
		const configs: any = {
			active: {
				bg: "bg-emerald-100 text-emerald-700 border-emerald-200",
				icon: CheckCircle,
				iconColor: "text-emerald-600",
			},
			sold: {
				bg: "bg-blue-100 text-blue-700 border-blue-200",
				icon: ShoppingBag,
				iconColor: "text-blue-600",
			},
			pending: {
				bg: "bg-amber-100 text-amber-700 border-amber-200",
				icon: Clock,
				iconColor: "text-amber-600",
			},
			rejected: {
				bg: "bg-rose-100 text-rose-700 border-rose-200",
				icon: XCircle,
				iconColor: "text-rose-600",
			},
			draft: {
				bg: "bg-slate-100 text-slate-700 border-slate-200",
				icon: FileText,
				iconColor: "text-slate-600",
			},
		};
		return configs[status] || configs.draft;
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Loader2 className='animate-spin w-12 h-12 text-blue-500' />
			</div>
		);
	}

	const totalListings = listings.length;
	const activeListings = listings.filter(
		(l: any) => l.status === "active"
	).length;
	const pendingListings = listings.filter(
		(l: any) => l.status === "pending"
	).length;
	const soldListings = listings.filter(
		(l: any) => l.status === "sold"
	).length;
	const totalEarnings = profile?.totalSales || 0;
	const totalViews = listings.reduce(
		(sum: number, l: any) => sum + (l.views || 0),
		0
	);
	const totalBids = listings.reduce(
		(sum: number, l: any) => sum + (l.bids?.length || 0),
		0
	);

	const filteredListings = listings.filter((listing: any) => {
		const matchesStatus =
			statusFilter === "all" || listing.status === statusFilter;
		const matchesSearch =
			searchQuery === "" ||
			listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			listing.category
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			listing.description
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 lg:p-8 pb-24 md:pb-8'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
						<div>
							<h1 className='text-2xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2'>
								Welcome back, {user?.name || "User"}
							</h1>
							<p className='text-slate-600 text-sm md:text-base'>
								Manage your digital assets and track your sales
								performance
							</p>
						</div>
						<div className='flex gap-2 flex-wrap'>
							<Link href={`/profile/${user?._id}`}>
								<Button className='bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white gap-2 shadow-lg shadow-sky-500/20'>
									<User size={18} />
									Profile
								</Button>
							</Link>
							<Link href='/dashboard/create-listing'>
								<Button className='bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20'>
									<Plus size={18} />
									Create Listing
								</Button>
							</Link>
							<Link href='/dashboard/blogs'>
								<Button className='bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-2 shadow-lg shadow-purple-500/20'>
									<BookOpen size={18} />
									Blogs
								</Button>
							</Link>
							<Link href='/dashboard/upgrade'>
								<Button className='bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white gap-2 shadow-lg shadow-orange-500/20'>
									<TrendingUp size={18} />
									Upgrade
								</Button>
							</Link>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8'>
					<Card className='bg-linear-to-br from-white to-blue-50/30 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-2'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Total Listings
									</p>
									<p className='text-xl md:text-3xl font-bold text-slate-900 mb-1'>
										{totalListings}
									</p>
									<div className='flex items-center gap-1 text-[10px] md:text-xs text-slate-500'>
										<FileText
											size={10}
											className='md:w-3 md:h-3'
										/>
										<span className='hidden md:inline'>
											Your listings
										</span>
										<span className='md:hidden'>
											Listings
										</span>
									</div>
								</div>
								<div className='w-10 h-10 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20'>
									<FileText
										size={18}
										className='md:w-6 md:h-6 text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-2'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Total Earnings
									</p>
									<p className='text-xl md:text-3xl font-bold text-emerald-600 mb-1 truncate'>
										${totalEarnings.toLocaleString()}
									</p>
									<div className='flex items-center gap-1 text-[10px] md:text-xs text-slate-500'>
										<DollarSign
											size={10}
											className='md:w-3 md:h-3'
										/>
										<span className='hidden md:inline'>
											All time
										</span>
										<span className='md:hidden'>
											Earnings
										</span>
									</div>
								</div>
								<div className='w-10 h-10 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20'>
									<DollarSign
										size={18}
										className='md:w-6 md:h-6 text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-purple-50/30 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-2'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Total Views
									</p>
									<p className='text-xl md:text-3xl font-bold text-purple-600 mb-1'>
										{totalViews.toLocaleString()}
									</p>
									<div className='flex items-center gap-1 text-[10px] md:text-xs text-slate-500'>
										<Eye
											size={10}
											className='md:w-3 md:h-3'
										/>
										<span className='hidden md:inline'>
											All listings
										</span>
										<span className='md:hidden'>Views</span>
									</div>
								</div>
								<div className='w-10 h-10 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20'>
									<Eye
										size={18}
										className='md:w-6 md:h-6 text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-linear-to-br from-white to-cyan-50/30 border border-cyan-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
						<CardContent className='p-4 md:p-6'>
							<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-2'>
								<div className='flex-1 min-w-0'>
									<p className='text-slate-600 text-xs md:text-sm font-medium mb-1'>
										Total Bids
									</p>
									<p className='text-xl md:text-3xl font-bold text-cyan-600 mb-1'>
										{totalBids}
									</p>
									<div className='flex items-center gap-1 text-[10px] md:text-xs text-slate-500'>
										<TrendingUp
											size={10}
											className='md:w-3 md:h-3'
										/>
										<span className='hidden md:inline'>
											Received
										</span>
										<span className='md:hidden'>Bids</span>
									</div>
								</div>
								<div className='w-10 h-10 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
									<TrendingUp
										size={18}
										className='md:w-6 md:h-6 text-white'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Additional Stats */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-4'>
							<div className='flex items-center gap-2'>
								<CheckCircle
									size={20}
									className='text-emerald-500'
								/>
								<div>
									<p className='text-xs text-slate-500'>
										Active
									</p>
									<p className='text-lg font-bold text-slate-900'>
										{activeListings}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-4'>
							<div className='flex items-center gap-2'>
								<Clock size={20} className='text-amber-500' />
								<div>
									<p className='text-xs text-slate-500'>
										Pending
									</p>
									<p className='text-lg font-bold text-slate-900'>
										{pendingListings}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-4'>
							<div className='flex items-center gap-2'>
								<ShoppingBag
									size={20}
									className='text-blue-500'
								/>
								<div>
									<p className='text-xs text-slate-500'>
										Sold
									</p>
									<p className='text-lg font-bold text-slate-900'>
										{soldListings}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-4'>
							<div className='flex items-center gap-2'>
								<Star
									size={20}
									className='text-amber-500 fill-amber-500'
								/>
								<div>
									<p className='text-xs text-slate-500'>
										Rating
									</p>
									<p className='text-lg font-bold text-slate-900'>
										{(profile?.rating || 0).toFixed(1)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<div className='grid'>
					{/* Listings */}
					<div className='lg:col-span-2'>
						<Card className='bg-white border border-slate-200 shadow-lg'>
							<CardHeader>
								<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
									<div>
										<CardTitle className='text-xl font-bold text-slate-900'>
											Your Listings
										</CardTitle>
										<CardDescription className='text-slate-600'>
											Manage and monitor your active
											listings
										</CardDescription>
									</div>
								</div>

								{/* Search and Filters */}
								<div className='flex flex-col md:flex-row gap-4'>
									<div className='relative flex-1'>
										<Search
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
											size={18}
										/>
										<Input
											placeholder='Search listings...'
											value={searchQuery}
											onChange={(e) =>
												setSearchQuery(e.target.value)
											}
											className='pl-10 pr-4 h-10 bg-white border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
										/>
									</div>
									<div className='flex items-center gap-2 flex-wrap'>
										<div className='flex items-center gap-2 text-slate-600 text-sm font-medium'>
											<Filter size={16} />
											<span>Filter:</span>
										</div>
										{[
											"all",
											"active",
											"pending",
											"sold",
											"draft",
											"rejected",
										].map((status) => {
											const count =
												status === "all"
													? listings.length
													: listings.filter(
															(l: any) =>
																l.status ===
																status
													  ).length;
											return (
												<Button
													key={status}
													variant='ghost'
													size='sm'
													onClick={() =>
														setStatusFilter(status)
													}
													className={`relative cursor-pointer transition-all duration-200 gap-2 h-9 px-3 ${
														statusFilter === status
															? "bg-linear-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/30 hover:from-sky-600 hover:to-blue-600"
															: "border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
													}`}>
													<span className='font-medium text-xs'>
														{status
															.charAt(0)
															.toUpperCase() +
															status.slice(1)}
													</span>
													{statusFilter ===
														status && (
														<span className='ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold'>
															{count}
														</span>
													)}
												</Button>
											);
										})}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-4 md:space-y-6'>
									{filteredListings.length > 0 ? (
										filteredListings.map((listing: any) => {
											const statusConfig =
												getStatusConfig(listing.status);
											const StatusIcon =
												statusConfig.icon;
											return (
												<Card
													key={listing._id}
													className='bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group'>
													<CardContent className='p-6'>
														<div className='flex flex-col lg:flex-row gap-6'>
															{/* Thumbnail Section */}
															<div className='lg:w-60'>
																<div className='relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100'>
																	<img
																		src={
																			listing.thumbnail ||
																			"/deelzobanner.png"
																		}
																		alt={
																			listing.title
																		}
																		className='w-full max-h-[400px] object-cover group-hover:scale-105 transition-transform duration-300'
																	/>
																	<div className='absolute top-3 right-3'>
																		<div
																			className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bg} shadow-sm`}>
																			<StatusIcon
																				size={
																					14
																				}
																				className={
																					statusConfig.iconColor
																				}
																			/>
																			<span className='text-xs font-semibold capitalize'>
																				{
																					listing.status
																				}
																			</span>
																		</div>
																	</div>
																</div>
															</div>

															{/* Content Section */}
															<div className='flex-1 min-w-0'>
																{/* Header */}
																<div className='mb-4'>
																	<h3 className='text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors'>
																		{
																			listing.title
																		}
																	</h3>
																	<p className='text-slate-600 mb-3 line-clamp-2'>
																		{
																			listing.description
																		}
																	</p>
																	<div className='flex items-center gap-3 flex-wrap'>
																		<span className='px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200'>
																			{
																				listing.category
																			}
																		</span>
																	</div>
																</div>

																{/* Key Info Grid */}
																<div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
																	<div className='bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-3 border border-emerald-100'>
																		<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
																			<DollarSign
																				size={
																					12
																				}
																				className='text-emerald-600'
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
																		<p className='text-xs text-slate-500 mb-1 font-medium flex items-center gap-1'>
																			<Eye
																				size={
																					12
																				}
																			/>
																			Views
																		</p>
																		<p className='text-sm font-bold text-slate-900'>
																			{listing.views ||
																				0}
																		</p>
																	</div>
																	<div className='bg-slate-50 rounded-lg p-3 border border-slate-100'>
																		<p className='text-xs text-slate-500 mb-1 font-medium flex items-center gap-1'>
																			<TrendingUp
																				size={
																					12
																				}
																			/>
																			Bids
																		</p>
																		<p className='text-sm font-bold text-slate-900'>
																			{listing
																				.bids
																				?.length ||
																				0}
																		</p>
																	</div>
																	<div className='bg-slate-50 rounded-lg p-3 border border-slate-100'>
																		<p className='text-xs text-slate-500 mb-1 font-medium flex items-center gap-1'>
																			<Calendar
																				size={
																					12
																				}
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
																	<div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-linear-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200 shadow-sm mb-4'>
																		{listing
																			.metrics
																			.monthlyRevenue && (
																			<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
																				<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
																					<DollarSign
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
																		{listing
																			.metrics
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
																		{listing
																			.metrics
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
																		{listing
																			.metrics
																			.country && (
																			<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
																				<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
																					<MapPin
																						size={
																							12
																						}
																						className='text-rose-600'
																					/>
																					Country
																				</p>
																				<p className='text-sm font-bold text-slate-900'>
																					{
																						listing
																							.metrics
																							.country
																					}
																				</p>
																			</div>
																		)}
																	</div>
																)}

																{/* Action Buttons */}
																<div className='flex flex-wrap gap-2 pt-4 border-t border-slate-200'>
																	<Button
																		variant='outline'
																		size='sm'
																		onClick={() => {
																			setSelectedListing(
																				listing
																			);
																			setShowPreview(
																				true
																			);
																		}}
																		className='border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5'>
																		<Eye
																			size={
																				16
																			}
																		/>
																		Preview
																	</Button>

																	<Select
																		value={
																			listing.status
																		}
																		onValueChange={(
																			value: string
																		) =>
																			handleUpdateStatus(
																				listing._id,
																				value
																			)
																		}
																		disabled={
																			updating ===
																			listing._id
																		}>
																		<SelectTrigger className='w-[140px] border-slate-200'>
																			<SelectValue placeholder='Status' />
																		</SelectTrigger>
																		<SelectContent>
																			{[
																				"active",
																				"pending",
																				"sold",
																				"draft",
																			].map(
																				(
																					status
																				) => (
																					<SelectItem
																						key={
																							status
																						}
																						value={
																							status
																						}>
																						{status
																							.charAt(
																								0
																							)
																							.toUpperCase() +
																							status.slice(
																								1
																							)}
																					</SelectItem>
																				)
																			)}
																		</SelectContent>
																	</Select>

																	<Link
																		href={`/dashboard/edit-listing/${listing._id}`}>
																		<Button
																			variant='outline'
																			size='sm'
																			className='border-sky-200 text-sky-700 hover:bg-sky-50 gap-1.5'>
																			<Edit2
																				size={
																					16
																				}
																			/>
																			Edit
																		</Button>
																	</Link>

																	<Button
																		variant='destructive'
																		size='sm'
																		onClick={() =>
																			handleDeleteListing(
																				listing._id
																			)
																		}
																		disabled={
																			deleting ===
																			listing._id
																		}
																		className='bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white gap-1.5 shadow-lg shadow-rose-500/20'>
																		{deleting ===
																		listing._id ? (
																			<Loader2
																				size={
																					16
																				}
																				className='animate-spin'
																			/>
																		) : (
																			<Trash2
																				size={
																					16
																				}
																			/>
																		)}
																		Delete
																	</Button>
																</div>
															</div>
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
														: "No listings available"}
												</p>
												{searchQuery ? (
													<p className='text-slate-500 text-sm mb-4'>
														Try adjusting your
														search or filter
														criteria
													</p>
												) : (
													<Link href='/dashboard/create-listing'>
														<Button className='bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20 mt-4'>
															<Plus size={18} />
															Create Your First
															Listing
														</Button>
													</Link>
												)}
											</CardContent>
										</Card>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Preview Modal */}
			{showPreview && selectedListing && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
					<Card className='bg-white border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
						<CardHeader className='flex flex-row items-center justify-between border-b border-slate-200'>
							<div>
								<CardTitle className='text-2xl font-bold text-slate-900'>
									{selectedListing.title}
								</CardTitle>
								<CardDescription className='text-slate-600 mt-1'>
									{selectedListing.category}
								</CardDescription>
							</div>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => setShowPreview(false)}
								className='hover:bg-slate-100'>
								<X size={20} />
							</Button>
						</CardHeader>
						<CardContent className='space-y-6 p-6'>
							{selectedListing.thumbnail && (
								<div className='relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-100'>
									<img
										src={
											selectedListing.thumbnail ||
											"/placeholder.svg"
										}
										alt={selectedListing.title}
										className='w-full h-full object-cover'
									/>
								</div>
							)}

							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								<div className='bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border border-emerald-100'>
									<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
										<DollarSign
											size={14}
											className='text-emerald-600'
										/>
										Price
									</p>
									<p className='text-xl font-bold text-emerald-700'>
										$
										{selectedListing.price?.toLocaleString() ||
											"0"}
									</p>
								</div>
								<div className='bg-slate-50 rounded-lg p-4 border border-slate-100'>
									<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
										<Eye size={14} />
										Views
									</p>
									<p className='text-xl font-bold text-slate-900'>
										{selectedListing.views || 0}
									</p>
								</div>
								<div className='bg-slate-50 rounded-lg p-4 border border-slate-100'>
									<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
										<TrendingUp size={14} />
										Bids
									</p>
									<p className='text-xl font-bold text-slate-900'>
										{selectedListing.bids?.length || 0}
									</p>
								</div>
								<div className='bg-slate-50 rounded-lg p-4 border border-slate-100'>
									<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
										<Calendar size={14} />
										Created
									</p>
									<p className='text-xl font-bold text-slate-900'>
										{selectedListing.createdAt
											? new Date(
													selectedListing.createdAt
											  ).toLocaleDateString()
											: "N/A"}
									</p>
								</div>
							</div>

							<div>
								<p className='text-sm font-semibold text-slate-700 mb-2'>
									Description
								</p>
								<p className='text-slate-900 leading-relaxed'>
									{selectedListing.description}
								</p>
							</div>

							{selectedListing.metrics && (
								<div>
									<p className='text-sm font-semibold text-slate-700 mb-3'>
										Metrics
									</p>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-linear-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200'>
										{selectedListing.metrics
											.monthlyRevenue && (
											<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
												<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
													<DollarSign
														size={12}
														className='text-emerald-600'
													/>
													Monthly Revenue
												</p>
												<p className='text-sm font-bold text-slate-900'>
													$
													{selectedListing.metrics.monthlyRevenue.toLocaleString()}
												</p>
											</div>
										)}
										{selectedListing.metrics
											.monthlyTraffic && (
											<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
												<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
													<Eye
														size={12}
														className='text-blue-600'
													/>
													Monthly Traffic
												</p>
												<p className='text-sm font-bold text-slate-900'>
													{selectedListing.metrics.monthlyTraffic.toLocaleString()}
												</p>
											</div>
										)}
										{selectedListing.metrics.followers && (
											<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
												<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
													<Users
														size={12}
														className='text-purple-600'
													/>
													Followers
												</p>
												<p className='text-sm font-bold text-slate-900'>
													{selectedListing.metrics.followers.toLocaleString()}
												</p>
											</div>
										)}
										{selectedListing.metrics
											.subscribers && (
											<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
												<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
													<Users
														size={12}
														className='text-cyan-600'
													/>
													Subscribers
												</p>
												<p className='text-sm font-bold text-slate-900'>
													{selectedListing.metrics.subscribers.toLocaleString()}
												</p>
											</div>
										)}
										{selectedListing.metrics.country && (
											<div className='bg-white/60 rounded-lg p-3 border border-white/80'>
												<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
													<MapPin
														size={12}
														className='text-rose-600'
													/>
													Country
												</p>
												<p className='text-sm font-bold text-slate-900'>
													{
														selectedListing.metrics
															.country
													}
												</p>
											</div>
										)}
										{selectedListing.metrics.assetLink && (
											<div className='bg-white/60 rounded-lg p-3 border border-white/80 col-span-2 md:col-span-4'>
												<p className='text-xs text-slate-600 mb-1 font-medium flex items-center gap-1'>
													<LinkIcon
														size={12}
														className='text-sky-600'
													/>
													Asset Link
												</p>
												<a
													href={
														selectedListing.metrics
															.assetLink
													}
													target='_blank'
													rel='noopener noreferrer'
													className='text-sm font-semibold text-sky-600 hover:text-sky-700 truncate block'>
													{
														selectedListing.metrics
															.assetLink
													}
												</a>
											</div>
										)}
									</div>
								</div>
							)}

							<div className='flex gap-3 pt-4 border-t border-slate-200'>
								<Link
									target='_blank'
									href={`/listing/${
										selectedListing?.slug ||
										selectedListing?._id
									}`}
									className='flex-1'>
									<Button className='w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white gap-2'>
										View Listing
										<ArrowUpRight size={16} />
									</Button>
								</Link>
								<Link
									href={`/dashboard/edit-listing/${selectedListing._id}`}
									className='flex-1'>
									<Button
										variant='outline'
										className='w-full border-sky-200 text-sky-700 hover:bg-sky-50 gap-2'>
										<Edit2 size={16} />
										Edit Listing
									</Button>
								</Link>
								<Button
									variant='outline'
									onClick={() => setShowPreview(false)}
									className='border-slate-200'>
									Close
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
