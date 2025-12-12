"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, TrendingUp, Phone } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import { userContext } from "@/context/userContext";

export default function AdminUsersPage() {
	const { user } = userContext();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingUser, setEditingUser] = useState<any>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				if (!user) {
					return;
				}
				const response = await fetch(
					`/api/admin/users?adminId=${user?._id}`
				);
				const data = await response.json();
				setUsers(data);
			} catch (error) {
				console.error("Failed to fetch users:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [user]);

	const filteredUsers = users.filter(
		(user: any) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// HANDLERS FOR ACTION BUTTONS
	const handleVerifyUser = async (targetUser: any, verify: boolean) => {
		if (!user) return;
		try {
			await fetch("/api/admin/users", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: targetUser._id,
					action: verify ? "verify" : "unverify",
					adminId: user._id,
				}),
			});
			setUsers((prev: any) =>
				prev.map((u: any) =>
					u._id === targetUser._id ? { ...u, verified: verify } : u
				)
			);
		} catch (err) {
			alert("Failed to update verification status.");
		}
	};

	const handleBlockUser = async (targetUser: any, block: boolean) => {
		if (!user) return;
		try {
			await fetch("/api/admin/users", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: targetUser._id,
					action: block ? "block" : "unblock",
					adminId: user._id,
				}),
			});
			setUsers((prev: any) =>
				prev.map((u: any) =>
					u._id === targetUser._id ? { ...u, isBlocked: block } : u
				)
			);
		} catch (err) {
			alert(block ? "Failed to block user." : "Failed to unblock user.");
		}
	};

	const handleDeleteUser = async (targetUser: any) => {
		if (!user) return;
		if (
			!confirm(
				"Are you sure you want to delete this user? This cannot be undone."
			)
		)
			return;
		try {
			await fetch(
				`/api/admin/users?adminId=${user._id}&userId=${targetUser._id}`,
				{
					method: "DELETE",
				}
			);
			setUsers((prev: any) =>
				prev.filter((u: any) => u._id !== targetUser._id)
			);
		} catch (err) {
			alert("Failed to delete user.");
		}
	};

	const handleEditUser = (targetUser: any) => {
		// Placeholder for edit modal logic
		setEditingUser(targetUser);
		alert("Edit user coming soon!");
	};

	return (
		<div className='flex min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
			<AdminSidebar />

			{/* Main Content */}
			<main className='flex-1 md:ml-64 p-4 md:p-8'>
				{/* Header */}
				<div className='mb-8 mt-12 md:mt-0'>
					<h1 className='text-3xl md:text-4xl font-bold text-slate-900 mb-2'>
						Manage Users
					</h1>
					<p className='text-slate-600'>
						View and manage all registered users
					</p>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-6'>
							<p className='text-slate-600 text-sm'>
								Total Users
							</p>
							<p className='text-3xl font-bold text-slate-900 mt-2'>
								{users.length}
							</p>
						</CardContent>
					</Card>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-6'>
							<p className='text-slate-600 text-sm'>
								Verified Users
							</p>
							<p className='text-3xl font-bold text-emerald-600 mt-2'>
								{users.filter((u: any) => u.verified).length}
							</p>
						</CardContent>
					</Card>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-6'>
							<p className='text-slate-600 text-sm'>
								Unverified Users
							</p>
							<p className='text-3xl font-bold text-amber-600 mt-2'>
								{users.filter((u: any) => !u.verified).length}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Search Bar */}
				<div className='mb-6'>
					<input
						type='text'
						placeholder='Search by name or email...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
					/>
				</div>

				{/* Users Table */}
				<div className='overflow-x-auto'>
					<Card className='bg-white border border-slate-200 shadow-sm'>
						<CardContent className='p-0'>
							{loading ? (
								<div className='p-12 text-center'>
									<p className='text-slate-600'>
										Loading users...
									</p>
								</div>
							) : filteredUsers.length > 0 ? (
								<div className='overflow-x-auto'>
									<table className='w-full'>
										<thead>
											<tr className='border-b border-slate-200 bg-slate-50'>
												<th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>
													Name
												</th>
												<th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>
													Email
												</th>
												<th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>
													Listings
												</th>
												<th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>
													Rating
												</th>
												<th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>
													Joined
												</th>
												<th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>
													Actions
												</th>
											</tr>
										</thead>
										<tbody>
											{filteredUsers.map((user: any) => (
												<tr
													key={user._id}
													className='border-b border-slate-100 hover:bg-slate-50 transition-colors'>
													<td className='px-6 py-4 text-sm text-slate-900 font-medium'>
														{user.name}
													</td>
													<td className='px-6 py-4 text-sm text-slate-700 items-center gap-2'>
														<span className='flex gap-1 items-center'>
															<Mail size={16} />
															{user.email}
														</span>
														<span className='flex gap-1 items-center'>
															<Phone size={16} />
															{user.phone ||
																"Unknown"}
														</span>
													</td>
													<td className='px-6 py-4 text-sm text-slate-900'>
														{user.listings.length}
													</td>
													<td className='px-6 py-4 text-sm text-slate-900 flex items-center gap-1'>
														<TrendingUp
															size={16}
															className='text-amber-500'
														/>
														{user.rating.toFixed(1)}
													</td>
													<td className='px-6 py-4 text-sm text-slate-700'>
														{new Date(
															user.createdAt
														).toLocaleDateString()}
													</td>
													<td className='px-6 py-4 text-sm'>
														<div className='flex flex-wrap gap-2'>
															<Button
																size='sm'
																variant='outline'
																className='border-slate-200 text-slate-700 hover:bg-slate-100 text-xs px-3 cursor-pointer'
																onClick={() =>
																	handleEditUser(
																		user
																	)
																}>
																Edit
															</Button>
															{user.verified ? (
																<Button
																	size='sm'
																	variant='outline'
																	className='border-amber-200 text-amber-700 hover:bg-amber-50 text-xs px-3 cursor-pointer'
																	onClick={() =>
																		handleVerifyUser(
																			user,
																			false
																		)
																	}
																	disabled={
																		user.isBlocked
																	}>
																	Unverify
																</Button>
															) : (
																<Button
																	size='sm'
																	variant='outline'
																	className='border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs px-3 cursor-pointer'
																	onClick={() =>
																		handleVerifyUser(
																			user,
																			true
																		)
																	}
																	disabled={
																		user.isBlocked
																	}>
																	Verify
																</Button>
															)}
															<Button
																size='sm'
																variant='outline'
																className={`cursor-pointer text-xs px-3 ${
																	user.isBlocked
																		? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
																		: "border-rose-200 text-rose-700 hover:bg-rose-50"
																}`}
																onClick={() =>
																	handleBlockUser(
																		user,
																		!user.isBlocked
																	)
																}>
																{user.isBlocked
																	? "Unblock"
																	: "Block"}
															</Button>
															<Button
																size='sm'
																variant='destructive'
																className='text-xs px-3 bg-rose-500 cursor-pointer border-rose-500 hover:bg-rose-600 hover:border-rose-600 text-white'
																onClick={() =>
																	handleDeleteUser(
																		user
																	)
																}
																disabled={
																	user.isBlocked
																}>
																Delete
															</Button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className='p-12 text-center'>
									<p className='text-slate-600'>
										No users found
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
