"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Trash2,
	Eye,
	EyeOff,
	DollarSign,
	User,
	CheckCircle,
	XCircle,
	Edit2,
	ChevronDown,
	EyeIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import { toast } from "sonner";
import { userContext } from "@/context/userContext";
import axios from "axios";
import Link from "next/link";

export default function AdminListingsPage() {
	const { user } = userContext();
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [deleting, setDeleting] = useState<any>(null);
	const [updating, setUpdating] = useState<any>(null);

	const fetchListings = async () => {
		try {
			if (!user) {
				return;
			}
			const statusParam = filter !== "all" ? `&status=${filter}` : "";
			const response = await axios.get(
				`/api/admin/all-listings?adminId=${user?._id}${statusParam}`
			);
			setListings(response.data);
		} catch (error) {
			console.error("Failed to fetch listings:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchListings();
	}, [filter, user]);

	const handleDeleteListing = async (listingId: string) => {
		if (!window.confirm("Are you sure you want to delete this listing?"))
			return;

		setDeleting(listingId);
		try {
			if (!user) {
				return;
			}
			const response = await axios.delete(`/api/listings/${listingId}`, {
				data: { userId: user?._id },
			});

			if (response.data.success) {
				toast.success("Listing deleted successfully");
				await fetchListings();
			} else {
				toast.error("Failed to delete listing");
			}
		} catch (error) {
			console.error("Delete error:", error);
			toast.error("Error deleting listing");
		} finally {
			setDeleting(null);
		}
	};

	const handleUpdateStatus = async (listingId: string, newStatus: string) => {
		setUpdating(listingId);
		try {
			const response = await axios.put(`/api/admin/all-listings`, {
				listingId,
				action: newStatus,
				adminId: user?._id,
			});

			if (response.data.success) {
				toast.success("Status updated");
				await fetchListings();
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
				return "bg-slate-500/20 text-slate-400 border-slate-500/30";
		}
	};

	const filteredListings = listings.filter(
		(listing: any) =>
			listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			listing.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
			<AdminSidebar />

			{/* Main Content */}
			<main className='flex-1 md:ml-64 p-4 md:p-8'>
				{/* Header */}
				<div className='mb-8 mt-12 md:mt-0'>
					<h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
						Manage Listings
					</h1>
					<p className='text-slate-400'>
						View and manage all marketplace listings
					</p>
				</div>

				{/* Filter and Search */}
				<div className='flex flex-col md:flex-row gap-4 mb-6'>
					<input
						type='text'
						placeholder='Search by title or category...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500'
					/>
					<div className='flex gap-2'>
						{["all", "active", "inactive", "pending"].map(
							(status) => (
								<Button
									key={status}
									onClick={() => setFilter(status)}
									variant={
										filter === status
											? "default"
											: "outline"
									}
									className={
										filter === status
											? "bg-linear-to-br from-blue-500 to-cyan-500 cursor-pointer"
											: "border-slate-600 text-slate-500 cursor-pointer hover:text-slate-300 hover:bg-slate-700"
									}>
									{status.charAt(0).toUpperCase() +
										status.slice(1)}
								</Button>
							)
						)}
					</div>
				</div>

				{/* Listings Grid */}
				<div className='grid grid-cols-1 gap-6'>
					{loading ? (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<p className='text-slate-400'>
									Loading listings...
								</p>
							</CardContent>
						</Card>
					) : filteredListings.length > 0 ? (
						filteredListings.map((listing: any) => (
							<Card
								key={listing._id}
								className='bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors'>
								<CardContent className='p-6'>
									<div
										key={listing._id}
										className='p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600'>
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
														<h3 className='font-semibold text-white text-lg truncate text-wrap'>
															{listing.title}
														</h3>
														<p className='text-sm text-slate-400'>
															{listing.category}
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
												<div className='grid grid-cols-4 md:grid-cols-6 gap-3 mb-4 text-sm'>
													<div>
														<p className='text-slate-400'>
															Link
														</p>
														<p className='font-bold text-white'>
															{
																listing.metrics
																	.assetLink
															}
														</p>
													</div>
													<div>
														<p className='text-slate-400'>
															Price
														</p>
														<p className='font-bold text-white'>
															$
															{listing.price.toLocaleString()}
														</p>
													</div>
													<div>
														<p className='text-slate-400'>
															Country
														</p>
														<p className='font-bold text-white'>
															{
																listing.metrics
																	.country
															}
														</p>
													</div>
													<div>
														<p className='text-slate-400'>
															Views
														</p>
														<p className='font-bold text-white'>
															{listing.views}
														</p>
													</div>
													<div>
														<p className='text-slate-400'>
															Bids
														</p>
														<p className='font-bold text-white'>
															{listing.bids
																?.length || 0}
														</p>
													</div>
													<div>
														<p className='text-slate-400'>
															Created
														</p>
														<p className='font-bold text-white'>
															{new Date(
																listing.createdAt
															).toLocaleDateString()}
														</p>
													</div>
												</div>

												{/* Action Buttons */}
												<div className='flex flex-wrap gap-2'>
													<Link
														href={`/listing/${listing?._id}`}>
														<button className='px-3 py-1 cursor-pointer bg-slate-600 hover:bg-slate-500 text-white rounded text-sm font-medium transition-colors flex items-center gap-1'>
															<EyeIcon
																size={16}
															/>
															Preview
														</button>
													</Link>

													<div className='relative group'>
														<button className='px-3 py-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1'>
															Status
															<ChevronDown
																size={16}
															/>
														</button>
														<div className='absolute left-0 mt-1 w-32 bg-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10'>
															{[
																"active",
																"pending",
																"sold",
																"draft",
																"rejected",
															].map((status) => (
																<button
																	key={status}
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
															))}
														</div>
													</div>

													<Link
														href={`/dashboard/edit-listing/${listing._id}`}>
														<Button
															variant='outline'
															size='sm'
															className='bg-transparent cursor-pointer border-slate-500 text-white hover:bg-slate-600 gap-1'>
															<Edit2 size={16} />
															Edit
														</Button>
													</Link>

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
														className='px-3 cursor-pointer py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50'>
														<Trash2 size={16} />
														Delete
													</button>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card className='bg-slate-800 border-slate-700'>
							<CardContent className='p-12 text-center'>
								<p className='text-slate-400'>
									No listings found
								</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<p className='text-slate-400 text-sm'>
								Total Listings
							</p>
							<p className='text-3xl font-bold text-white mt-2'>
								{listings.length}
							</p>
						</CardContent>
					</Card>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<p className='text-slate-400 text-sm'>
								Active Listings
							</p>
							<p className='text-3xl font-bold text-green-500 mt-2'>
								{
									listings.filter(
										(l: any) => l.status === "active"
									).length
								}
							</p>
						</CardContent>
					</Card>
					<Card className='bg-slate-800 border-slate-700'>
						<CardContent className='p-6'>
							<p className='text-slate-400 text-sm'>
								Sold Listings
							</p>
							<p className='text-3xl font-bold text-red-500 mt-2'>
								{
									listings.filter(
										(l: any) => l.status === "sold"
									).length
								}
							</p>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
