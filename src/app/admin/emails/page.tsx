"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "@/components/admin-sidebar";
import { userContext } from "@/context/userContext";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Send, Filter, RefreshCw } from "lucide-react";

type Listing = {
	_id: string;
	title: string;
	description?: string;
	status: string;
	slug?: string;
	updatedAt?: string;
	createdAt?: string;
	seller?: {
		name?: string;
		email?: string;
		contactEmail?: string;
	};
};

type TemplateKey = "stale" | "pending_update" | "rejected_feedback" | "custom";

const templates: Record<
	TemplateKey,
	{ label: string; subject: string; body: string }
> = {
	stale: {
		label: "Follow-up: Listing inactive",
		subject: "Quick follow-up on your listing: {listingTitle}",
		body: `
Hi {sellerName},

We noticed your listing "{listingTitle}" hasn't been updated in a while. If anything has changed (pricing, metrics, or details), you can update it to attract more buyers.

Need help or have questions? Reply to this email and our team will assist you.

Thanks,
Deelzo Support
`,
	},
	pending_update: {
		label: "Action needed: Pending updates",
		subject: "Action needed on your listing: {listingTitle}",
		body: `
Hi {sellerName},

Your listing "{listingTitle}" is still pending updates. Please add the requested details so we can approve and feature it sooner.

If you're unsure what to change, reply here and we'll guide you through.

Thanks,
Deelzo Support
`,
	},
	rejected_feedback: {
		label: "We need a quick revision",
		subject: "Help us relist: {listingTitle}",
		body: `
Hi {sellerName},

We paused your listing "{listingTitle}" because we need a quick revision. Please review the feedback in your dashboard and re-submit when ready.

If you prefer, reply to this email and we can make the change for you.

Thanks,
Deelzo Support
`,
	},
	custom: {
		label: "Custom message",
		subject: "",
		body: "",
	},
};

export default function AdminEmails() {
	const { user } = userContext();
	const [listings, setListings] = useState<Listing[]>([]);
	const [filter, setFilter] = useState<string>("all");
	const [loading, setLoading] = useState<boolean>(true);
	const [sending, setSending] = useState<boolean>(false);
	const [selectedListingId, setSelectedListingId] = useState<string>("");
	const [selectedTemplate, setSelectedTemplate] =
		useState<TemplateKey>("stale");
	const [toEmail, setToEmail] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [body, setBody] = useState<string>("");
	const [search, setSearch] = useState<string>("");

	const fetchListings = async () => {
		if (!user?._id) return;
		setLoading(true);
		try {
			const res = await axios.get(
				`/api/admin/all-listings?adminId=${user._id}`
			);
			setListings(res.data || []);
		} catch (err) {
			console.error("Failed to load listings", err);
			toast.error("Could not load listings");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchListings();
	}, [user?._id]);

	const filteredListings = useMemo(() => {
		const byStatus =
			filter === "all"
				? listings
				: listings.filter(
						(listing) =>
							listing.status?.toLowerCase() ===
							filter.toLowerCase()
				  );

		if (!search.trim()) return byStatus;
		const term = search.toLowerCase();
		return byStatus.filter(
			(l) =>
				l.title.toLowerCase().includes(term) ||
				l.status?.toLowerCase().includes(term) ||
				l.seller?.name?.toLowerCase().includes(term)
		);
	}, [filter, listings, search]);

	const selectedListing: any = useMemo(
		() =>
			filteredListings.find((l) => l._id === selectedListingId) ||
			filteredListings[0],
		[filteredListings, selectedListingId]
	);

	useEffect(() => {
		if (!selectedListing) return;
		setSelectedListingId(selectedListing._id);

		const template = templates[selectedTemplate];
		const sellerName = selectedListing.seller?.name || "there";
		const listingTitle = selectedListing.title || "your listing";

		const nextSubject =
			selectedTemplate === "custom"
				? subject
				: template.subject
						.replace("{sellerName}", sellerName)
						.replace("{listingTitle}", listingTitle);

		const nextBody =
			selectedTemplate === "custom"
				? body
				: template.body
						.replace("{sellerName}", sellerName)
						.replace("{listingTitle}", listingTitle);

		setSubject(nextSubject);
		setBody(nextBody);
		setToEmail(selectedListing.seller.email);
	}, [selectedListing?._id, selectedTemplate]);

	const handleSend = async () => {
		if (!user?._id) {
			toast.error("You must be logged in as admin");
			return;
		}

		if (!toEmail || !subject || !body) {
			toast.error("To, subject, and body are required");
			return;
		}

		setSending(true);
		try {
			await axios.post("/api/admin/emails", {
				adminId: user._id,
				to: toEmail,
				subject,
				html: body,
				listingId: selectedListing?._id,
				template: selectedTemplate,
			});
			toast.success("Email sent");
		} catch (err) {
			console.error("Failed to send email", err);
			toast.error("Failed to send email");
		} finally {
			setSending(false);
		}
	};

	return (
		<div className='flex min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
			<AdminSidebar />

			<main className='flex-1 md:ml-64 p-4 md:p-8'>
				<div className='mb-8 mt-12 md:mt-0 flex flex-col gap-2'>
					<h1 className='text-3xl md:text-4xl font-bold text-slate-900'>
						Email Sellers
					</h1>
					<p className='text-slate-600'>
						Send HTML emails to sellers based on listing status or
						activity.
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8'>
					<Card className='bg-white border border-slate-200 shadow-sm lg:col-span-2'>
						<CardContent className='p-5 space-y-4'>
							<div className='flex items-center justify-between'>
								<h2 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
									<Filter size={18} />
									Listings
								</h2>
								<Button
									variant='outline'
									size='sm'
									className='cursor-pointer'
									onClick={fetchListings}
									disabled={loading}>
									<RefreshCw
										size={16}
										className={
											loading ? "animate-spin" : ""
										}
									/>
									Refresh
								</Button>
							</div>

							<div className='flex flex-col gap-3'>
								<div className='flex flex-wrap gap-2'>
									{[
										"all",
										"active",
										"pending",
										"rejected",
									].map((s) => (
										<Button
											key={s}
											variant={
												filter === s
													? "default"
													: "outline"
											}
											className={
												filter === s
													? "bg-linear-to-r from-sky-500 to-blue-500 text-white cursor-pointer"
													: "border-slate-200 text-slate-600 cursor-pointer hover:text-slate-900 hover:bg-slate-100"
											}
											onClick={() => setFilter(s)}>
											{s[0].toUpperCase() + s.slice(1)}
										</Button>
									))}
								</div>
								<Input
									placeholder='Search by title or seller...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
								<div className='max-h-[630px] overflow-auto border border-slate-200 rounded-lg divide-y divide-slate-100'>
									{loading ? (
										<div className='p-4 text-slate-600'>
											Loading listings...
										</div>
									) : filteredListings.length ? (
										filteredListings.map((listing) => (
											<button
												key={listing._id}
												onClick={() =>
													setSelectedListingId(
														listing._id
													)
												}
												className={`w-full text-left cursor-pointer p-4 hover:bg-slate-50 ${
													selectedListingId ===
													listing._id
														? "bg-slate-50"
														: ""
												}`}>
												<p className='font-semibold text-slate-900 line-clamp-1'>
													{listing.title}
												</p>
												<div className='flex text-xs text-slate-600 gap-3 mt-1'>
													<span className='capitalize'>
														{listing.status}
													</span>
													{listing.updatedAt && (
														<span>
															Updated{" "}
															{new Date(
																listing.updatedAt
															).toLocaleDateString()}
														</span>
													)}
												</div>
											</button>
										))
									) : (
										<div className='p-4 text-slate-600'>
											No listings found
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-white border border-slate-200 shadow-sm lg:col-span-3'>
						<CardContent className='p-5 space-y-5'>
							<div className='flex items-center justify-between'>
								<h2 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
									<Mail size={18} />
									Compose
								</h2>
								<div className='flex gap-2'>
									<select
										value={selectedTemplate}
										onChange={(e) =>
											setSelectedTemplate(
												e.target.value as TemplateKey
											)
										}
										className='border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500'>
										{Object.entries(templates).map(
											([key, value]) => (
												<option key={key} value={key}>
													{value.label}
												</option>
											)
										)}
									</select>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<label className='text-sm text-slate-700'>
										To
									</label>
									<Input
										value={toEmail}
										onChange={(e) =>
											setToEmail(e.target.value)
										}
										placeholder='seller@example.com'
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm text-slate-700'>
										Subject
									</label>
									<Input
										value={subject}
										onChange={(e) =>
											setSubject(e.target.value)
										}
										placeholder='Subject line'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<label className='text-sm text-slate-700'>
									HTML Body
								</label>
								<textarea
									value={body}
									onChange={(
										e: ChangeEvent<HTMLTextAreaElement>
									) => setBody(e.target.value)}
									rows={27}
									className='w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500'
									placeholder='Type or paste your HTML email...'
								/>
							</div>

							<div className='flex justify-end gap-3'>
								<Button
									variant='outline'
									className='cursor-pointer'
									onClick={() => {
										setSelectedTemplate("custom");
										setSubject("");
										setBody("");
									}}>
									Clear
								</Button>
								<Button
									onClick={handleSend}
									disabled={sending || loading}
									className='bg-linear-to-r from-sky-500 to-blue-500 text-white cursor-pointer hover:opacity-90'>
									{sending ? (
										<RefreshCw
											size={16}
											className='mr-2 animate-spin'
										/>
									) : (
										<Send size={16} className='mr-2' />
									)}
									Send email
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
