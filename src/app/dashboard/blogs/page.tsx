"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Loader2,
	Plus,
	Image as ImageIcon,
	Pencil,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import { userContext } from "@/context/userContext";
import Link from "next/link";

export default function UserBlogsPage() {
	const { user } = userContext();
	const [blogs, setBlogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchBlogs = async () => {
		if (!user) return;
		try {
			const res = await fetch(`/api/blogs?limit=100&userId=${user._id}`);
			const data = await res.json();
			if (data.success) {
				setBlogs(data.blogs);
			}
		} catch (error) {
			console.error("Failed to fetch blogs:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBlogs();
	}, [user]);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this blog?")) return;
		try {
			const res = await fetch(`/api/blogs/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success) {
				toast.success("Blog deleted successfully");
				fetchBlogs();
			} else {
				toast.error(data.message || "Failed to delete blog");
			}
		} catch (error) {
			toast.error("An error occurred");
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center p-8'>
				<Loader2 className='animate-spin' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 lg:p-8 pb-24 md:pb-8'>
			<div className='max-w-6xl mx-auto'>
				<div className='flex justify-between mb-8 items-center'>
					<div>
						<h1 className='text-3xl font-bold text-slate-900'>
							My Blogs
						</h1>
						<p className='text-slate-500 mt-1'>
							Manage your stories and drafts
						</p>
					</div>
					<Link href='/dashboard/add-blog'>
						<Button className='gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all'>
							<Plus size={16} /> New Blog
						</Button>
					</Link>
				</div>

				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{blogs.map((blog: any) => (
						<Card
							key={blog._id}
							className='p-0 overflow-hidden flex flex-col border-none shadow-sm hover:shadow-md transition-all group'>
							<div className='w-full h-48 relative bg-slate-100'>
								{blog.image ? (
									<Image
										src={blog.image}
										alt={blog.title}
										fill
										className='object-cover group-hover:scale-105 transition-transform duration-300'
									/>
								) : (
									<div className='flex items-center justify-center h-full text-slate-400'>
										<ImageIcon size={40} />
									</div>
								)}
								<div className='absolute top-3 right-3'>
									<span
										className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-xs ${
											blog.status === "published"
												? "bg-green-100/90 text-green-800"
												: blog.status === "rejected"
												? "bg-red-100/90 text-red-800"
												: blog.status === "draft"
												? "bg-slate-100/90 text-slate-800"
												: "bg-yellow-100/90 text-yellow-800"
										}`}>
										{blog.status.charAt(0).toUpperCase() +
											blog.status.slice(1)}
									</span>
								</div>
							</div>
							<CardContent className='p-5 flex-1 flex flex-col'>
								<h3 className='font-bold text-lg mb-2 line-clamp-2 text-slate-900 group-hover:text-blue-600 transition-colors'>
									{blog.title}
								</h3>
								<p className='text-sm text-slate-500 line-clamp-3 mb-4 flex-1'>
									{blog.seo?.metaDescription ||
										blog.content.replace(/<[^>]*>?/gm, "")}
								</p>
								<div className='flex items-center justify-between pt-4 border-t border-slate-100 mt-auto'>
									<span className='text-xs text-slate-400'>
										{new Date(
											blog.createdAt
										).toLocaleDateString()}
									</span>
									<div className='flex gap-2'>
										<Link
											href={`/dashboard/add-blog?id=${blog._id}`}>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 hover:bg-blue-50 hover:text-blue-600'>
												<Pencil size={16} />
											</Button>
										</Link>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 hover:bg-red-50 hover:text-red-600'
											onClick={() =>
												handleDelete(blog._id)
											}>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
					{blogs.length === 0 && (
						<div className='col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-200'>
							<div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Pencil className='text-slate-400' size={24} />
							</div>
							<h3 className='text-lg font-medium text-slate-900 mb-1'>
								No blogs yet
							</h3>
							<p className='text-slate-500 mb-4'>
								Create your first blog post to get started
							</p>
							<Link href='/dashboard/add-blog'>
								<Button>Create Blog</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
