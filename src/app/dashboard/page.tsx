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
import {
	Plus,
	Eye,
	DollarSign,
	TrendingUp,
	Trash2,
	Edit2,
	EyeIcon,
	ChevronDown,
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
			} else {
				alert("Failed to delete listing");
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
			const response = await fetch(`/api/listings/${listingId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user?._id, status: newStatus }),
			});

			if (response.ok) {
				await response.json();
				toast.success("Status updated");
				await fetchDashboardData();
			} else {
				alert("Failed to update status");
			}
		} catch (error) {
			console.error("Update error:", error);
			alert("Error updating status");
		} finally {
			setUpdating(null);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-500/20 text-green-400 border-green-500/30";
			case "sold":
				return "bg-blue-500/20 text-blue-400 border-blue-500/30";
			case "pending":
				return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
			case "rejected":
				return "bg-red-500/20 text-red-400 border-red-500/30";
			default:
				return "bg-gray-100 text-gray-600 border-gray-300";
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				Loading...
			</div>
		);
	}

	const stats = [
		{
			title: "Total Listings",
			value: profile?.listings.length || 0,
			icon: Eye,
			color: "bg-blue-500",
		},
		{
			title: "Sold",
			value: listings.filter((l: any) => l.status === "sold").length,
			icon: TrendingUp,
			color: "bg-green-500",
		},
		{
			title: "Total Sales",
			value: `$${(profile?.totalSales || 0).toLocaleString()}`,
			icon: DollarSign,
			color: "bg-purple-500",
		},
	];

	const filteredListings =
		statusFilter === "all"
			? listings
			: listings.filter((l: any) => l.status === statusFilter);

	return (
		<div className='min-h-screen bg-gray-50 p-4 md:p-8 pb-24 md:pb-8'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
					<div>
						<h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
							Welcome back, {user?.name}
						</h1>
						<p className='text-gray-600'>
							Manage your digital assets and track your sales
						</p>
					</div>
					<Link href='/dashboard/create-listing'>
						<Button className='bg-linear-to-br cursor-pointer from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2'>
							<Plus size={20} />
							Create Listing
						</Button>
					</Link>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-2 md:grid-cols-3 gap-6 mb-8'>
					{stats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<Card
								key={index}
								className='bg-white border-gray-200 shadow-sm hover:border-slate-600 transition-colors'>
								<CardContent className='p-6'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-gray-600 text-sm mb-1'>
												{stat.title}
											</p>
											<p className='text-2xl font-bold text-gray-900'>
												{stat.value}
											</p>
										</div>
										<div
											className={`${stat.color} p-3 rounded-lg`}>
											<Icon
												size={24}
												className='text-gray-900'
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Main Content */}
				<div className='grid'>
					{/* Listings */}
					<div className='lg:col-span-2'>
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
									<div>
										<CardTitle className='text-gray-900'>
											Your Listings
										</CardTitle>
										<CardDescription>
											Manage and monitor your active
											listings
										</CardDescription>
									</div>
									<div className='flex gap-2 flex-wrap'>
										{[
											"all",
											"active",
											"pending",
											"sold",
											"draft",
											"rejected",
										].map((status) => (
											<button
												key={status}
												onClick={() =>
													setStatusFilter(status)
												}
												className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
													statusFilter === status
														? "bg-blue-500 text-white"
														: "bg-gray-100 text-gray-700 hover:bg-gray-200"
												}`}>
												{status
													.charAt(0)
													.toUpperCase() +
													status.slice(1)}
											</button>
										))}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{filteredListings.length > 0 ? (
										filteredListings.map((listing: any) => (
											<div
												key={listing._id}
												className='p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200'>
												<div className='flex flex-col md:flex-row md:items-start gap-4'>
													{/* Thumbnail */}
													{listing.thumbnail && (
														<img
															src={
																listing.thumbnail ||
																"/placeholder.svg"
															}
															alt={listing.title}
															className='w-full md:w-24 h-24 object-cover rounded-lg'
														/>
													)}

													{/* Content */}
													<div className='flex-1 min-w-0'>
														<div className='flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2'>
															<div>
																<h3 className='font-semibold text-gray-900 text-lg truncate text-wrap'>
																	{
																		listing.title
																	}
																</h3>
																<p className='text-sm text-gray-600'>
																	{
																		listing.category
																	}
																</p>
															</div>
															<span
																className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
																	listing.status
																)}`}>
																{listing.status
																	.charAt(0)
																	.toUpperCase() +
																	listing.status.slice(
																		1
																	)}
															</span>
														</div>

														{/* Details Grid */}
														<div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm'>
															<div>
																<p className='text-gray-600'>
																	Price
																</p>
																<p className='font-bold text-gray-900'>
																	$
																	{listing.price.toLocaleString()}
																</p>
															</div>
															<div>
																<p className='text-gray-600'>
																	Views
																</p>
																<p className='font-bold text-gray-900'>
																	{
																		listing.views
																	}
																</p>
															</div>
															<div>
																<p className='text-gray-600'>
																	Bids
																</p>
																<p className='font-bold text-gray-900'>
																	{listing
																		.bids
																		?.length ||
																		0}
																</p>
															</div>
															<div>
																<p className='text-gray-600'>
																	Created
																</p>
																<p className='font-bold text-gray-900'>
																	{new Date(
																		listing.createdAt
																	).toLocaleDateString()}
																</p>
															</div>
														</div>

														{/* Action Buttons */}
														<div className='flex flex-wrap gap-2'>
															<button
																onClick={() => {
																	setSelectedListing(
																		listing
																	);
																	setShowPreview(
																		true
																	);
																}}
																className='px-3 py-1 cursor-pointer bg-slate-600 hover:bg-slate-500 text-white rounded text-sm font-medium transition-colors flex items-center gap-1'>
																<EyeIcon
																	size={16}
																/>
																Preview
															</button>

															<div className='relative group'>
																<button className='px-3 py-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1'>
																	Status
																	<ChevronDown
																		size={
																			16
																		}
																	/>
																</button>
																<div className='absolute left-0 mt-1 w-32 bg-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10'>
																	{[
																		"pending",
																		"sold",
																		"draft",
																	].map(
																		(
																			status
																		) => (
																			<button
																				key={
																					status
																				}
																				onClick={() =>
																					handleUpdateStatus(
																						listing._id,
																						status
																					)
																				}
																				disabled={
																					updating ===
																					listing._id
																				}
																				className='w-full text-left cursor-pointer px-4 py-2 text-sm text-white hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg transition-colors disabled:opacity-50'>
																				{status
																					.charAt(
																						0
																					)
																					.toUpperCase() +
																					status.slice(
																						1
																					)}
																			</button>
																		)
																	)}
																</div>
															</div>
															<Button
																variant='outline'
																onClick={() =>
																	alert(
																		"Coming soon......!"
																	)
																}
																size='sm'
																className='bg-transparent cursor-pointer border-slate-500 text-slate-600 hover:bg-slate-600 hover:text-white gap-1'>
																<Edit2
																	size={16}
																/>
																Edit
															</Button>

															<button
																onClick={() =>
																	handleDeleteListing(
																		listing._id
																	)
																}
																disabled={
																	deleting ===
																	listing._id
																}
																className='px-3 py-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50'>
																<Trash2
																	size={16}
																/>
																Delete
															</button>
														</div>
													</div>
												</div>
											</div>
										))
									) : (
										<p className='text-gray-600 text-center py-8'>
											No listings found. Create your first
											one!
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{showPreview && selectedListing && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
					<Card className='bg-white border-gray-200 shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<CardHeader className='flex flex-row items-center justify-between'>
							<div>
								<CardTitle className='text-gray-900'>
									{selectedListing.title}
								</CardTitle>
								<CardDescription>
									{selectedListing.category}
								</CardDescription>
							</div>
							<button
								onClick={() => setShowPreview(false)}
								className='text-gray-600 hover:text-white text-2xl'>
								×
							</button>
						</CardHeader>
						<CardContent className='space-y-4'>
							{selectedListing.thumbnail && (
								<img
									src={
										selectedListing.thumbnail ||
										"/placeholder.svg"
									}
									alt={selectedListing.title}
									className='w-full h-64 object-cover rounded-lg'
								/>
							)}

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-gray-600 text-sm'>
										Price
									</p>
									<p className='text-xl font-bold text-gray-900'>
										$
										{selectedListing.price.toLocaleString()}
									</p>
								</div>
								<div>
									<p className='text-gray-600 text-sm'>
										Status
									</p>
									<p
										className={`text-xl font-bold ${getStatusColor(
											selectedListing.status
										)}`}>
										{selectedListing.status
											.charAt(0)
											.toUpperCase() +
											selectedListing.status.slice(1)}
									</p>
								</div>
								<div>
									<p className='text-gray-600 text-sm'>
										Views
									</p>
									<p className='text-xl font-bold text-gray-900'>
										{selectedListing.views}
									</p>
								</div>
								<div>
									<p className='text-gray-600 text-sm'>
										Bids
									</p>
									<p className='text-xl font-bold text-gray-900'>
										{selectedListing.bids?.length || 0}
									</p>
								</div>
							</div>

							<div>
								<p className='text-gray-600 text-sm mb-2'>
									Description
								</p>
								<p className='text-gray-900'>
									{selectedListing.description}
								</p>
							</div>

							{selectedListing.metrics && (
								<div>
									<p className='text-gray-600 text-sm mb-2'>
										Metrics
									</p>
									<div className='grid grid-cols-2 gap-2 text-sm'>
										{selectedListing.metrics
											.monthlyRevenue && (
											<p className='text-gray-900'>
												Monthly Revenue:{" "}
												<span className='font-bold'>
													$
													{
														selectedListing.metrics
															.monthlyRevenue
													}
												</span>
											</p>
										)}
										{selectedListing.metrics
											.monthlyTraffic && (
											<p className='text-gray-900'>
												Monthly Traffic:{" "}
												<span className='font-bold'>
													{
														selectedListing.metrics
															.monthlyTraffic
													}
												</span>
											</p>
										)}
										{selectedListing.metrics.followers && (
											<p className='text-gray-900'>
												Followers:{" "}
												<span className='font-bold'>
													{
														selectedListing.metrics
															.followers
													}
												</span>
											</p>
										)}
										{selectedListing.metrics
											.subscribers && (
											<p className='text-gray-900'>
												Subscribers:{" "}
												<span className='font-bold'>
													{
														selectedListing.metrics
															.subscribers
													}
												</span>
											</p>
										)}
									</div>
								</div>
							)}

							<Button
								onClick={() => setShowPreview(false)}
								className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
								Close
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
