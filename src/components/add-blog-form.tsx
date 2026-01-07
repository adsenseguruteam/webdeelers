"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Loader2,
	Upload,
	X,
	ArrowLeft,
	Image as ImageIcon,
	Save,
	Send,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import axios from "axios";
import { userContext } from "@/context/userContext";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CATEGORIES = [
	"General",
	"Technology",
	"Business",
	"Lifestyle",
	"Health",
	"Travel",
	"Food",
	"Education",
];

interface AddBlogFormProps {
	redirectPath?: string;
	title?: string;
	initialData?: any;
}

export default function AddBlogForm({
	redirectPath,
	title = "Create New Blog",
	initialData,
}: AddBlogFormProps) {
	const router = useRouter();
	const { user } = userContext();
	const [loading, setLoading] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		content: "",
		category: "General",
		image: "",
		seo: {
			metaTitle: "",
			metaDescription: "",
			keywords: "",
		},
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				title: initialData.title || "",
				content: initialData.content || "",
				category: initialData.category || "General",
				image: initialData.image || "",
				seo: {
					metaTitle: initialData.seo?.metaTitle || "",
					metaDescription: initialData.seo?.metaDescription || "",
					keywords: initialData.seo?.keywords || "",
				},
			});
		}
	}, [initialData]);

	const modules = useMemo(
		() => ({
			toolbar: [
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				["bold", "italic", "underline", "strike", "blockquote"],
				[
					{ list: "ordered" },
					{ list: "bullet" },
					{ indent: "-1" },
					{ indent: "+1" },
				],
				["link", "image"],
				["clean"],
			],
		}),
		[]
	);

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingImage(true);
		try {
			// Get ImageKit auth
			const authRes = await axios.get("/api/imagekit/auth");
			const { token, expire, signature, publicKey } = authRes.data;

			const form = new FormData();
			form.append("file", file);
			form.append("fileName", file.name);
			form.append("publicKey", publicKey);
			form.append("signature", signature);
			form.append("expire", String(expire));
			form.append("token", token);
			form.append("useUniqueFileName", "true");

			const uploadRes = await axios.post(
				"https://upload.imagekit.io/api/v1/files/upload",
				form
			);

			if (uploadRes.data && uploadRes.data.url) {
				setFormData((prev) => ({ ...prev, image: uploadRes.data.url }));
				toast.success("Image uploaded successfully");
			} else {
				throw new Error("No URL returned");
			}
		} catch (error: any) {
			console.error("Upload failed:", error);
			// Fallback to local upload if ImageKit fails or not configured
			try {
				const formData = new FormData();
				formData.append("file", file);
				const localRes = await axios.post("/api/upload", formData);
				if (localRes.data.success) {
					setFormData((prev) => ({
						...prev,
						image: localRes.data.url,
					}));
					toast.success("Image uploaded successfully (local)");
				} else {
					toast.error("Failed to upload image");
				}
			} catch (localError) {
				toast.error("Image upload failed");
			}
		} finally {
			setUploadingImage(false);
		}
	};

	const removeImage = () => {
		setFormData((prev) => ({ ...prev, image: "" }));
	};

	const handleSubmit = async (status: "published" | "draft") => {
		if (!formData.title || !formData.content) {
			toast.error("Title and content are required");
			return;
		}

		setLoading(true);
		try {
			const payload = { ...formData, status };
			let res;

			if (initialData?._id) {
				res = await axios.put(`/api/blogs/${initialData._id}`, payload);
			} else {
				res = await axios.post("/api/blogs", payload);
			}

			if (res.data.success) {
				toast.success(
					status === "draft"
						? "Draft saved successfully!"
						: user?.role === "admin"
						? "Blog published successfully!"
						: "Blog submitted for review!"
				);
				if (redirectPath) {
					router.push(redirectPath);
				} else {
					router.push(
						user?.role === "admin"
							? "/admin/blogs"
							: "/dashboard/blogs"
					);
				}
			} else {
				toast.error(res.data.message || "Failed to save blog");
			}
		} catch (error: any) {
			const msg = error.response?.data?.message || "An error occurred";
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			<div className='flex flex-col md:flex-row gap-5 items-center md:justify-between'>
				<div className='flex items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.back()}
						className='rounded-full'>
						<ArrowLeft size={20} />
					</Button>
					<div>
						<h1 className='text-3xl font-bold text-slate-900'>
							{initialData ? "Edit Blog" : title}
						</h1>
						<p className='text-slate-500'>
							{initialData
								? "Update your content"
								: "Share your thoughts with the world"}
						</p>
					</div>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						onClick={() => handleSubmit("draft")}
						disabled={loading}>
						{loading ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : (
							<Save className='h-4 w-4 mr-2' />
						)}
						Save Draft
					</Button>
					<Button
						onClick={() => handleSubmit("published")}
						disabled={loading}>
						{loading ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : (
							<Send className='h-4 w-4 mr-2' />
						)}
						{user?.role === "admin" ? "Publish" : "Submit Review"}
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2 space-y-6'>
					<Card className='border-none shadow-sm'>
						<CardContent className='p-6 space-y-6'>
							<div className='space-y-2'>
								<Label htmlFor='title'>Blog Title</Label>
								<Input
									id='title'
									value={formData.title}
									onChange={(e) =>
										setFormData({
											...formData,
											title: e.target.value,
										})
									}
									placeholder='Enter an engaging title'
									className='text-lg md:text-xl font-medium'
								/>
							</div>

							<div className='space-y-2'>
								<Label>Content</Label>
								<div className='h-[600px] mb-12'>
									<ReactQuill
										theme='snow'
										placeholder='Write your content here...'
										value={formData.content}
										onChange={(value: string) =>
											setFormData({
												...formData,
												content: value,
											})
										}
										modules={modules}
										className='h-full'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className='space-y-6'>
					<Card className='border-none shadow-sm'>
						<CardHeader>
							<CardTitle className='text-lg'>
								Publishing Details
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-2'>
								<Label>Category</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										setFormData({
											...formData,
											category: value,
										})
									}>
									<SelectTrigger>
										<SelectValue placeholder='Select category' />
									</SelectTrigger>
									<SelectContent>
										{CATEGORIES.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label>Featured Image</Label>
								{formData.image && formData.image !== "" ? (
									<div className='relative aspect-video rounded-lg overflow-hidden border'>
										<Image
											src={formData.image}
											alt='Featured'
											fill
											className='object-cover'
										/>
										<Button
											variant='destructive'
											size='icon'
											className='absolute top-2 right-2 h-8 w-8'
											onClick={removeImage}>
											<X size={16} />
										</Button>
									</div>
								) : (
									<div className='border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer relative'>
										<Input
											type='file'
											accept='image/*'
											className='absolute inset-0 opacity-0 cursor-pointer'
											onChange={handleImageUpload}
											disabled={uploadingImage}
										/>
										{uploadingImage ? (
											<Loader2 className='h-8 w-8 animate-spin text-slate-400' />
										) : (
											<div className='flex flex-col items-center text-slate-500'>
												<div className='p-3 bg-slate-100 rounded-full mb-2'>
													<Upload size={20} />
												</div>
												<span className='text-sm font-medium'>
													Click to upload
												</span>
												<span className='text-xs text-slate-400'>
													JPG, PNG, WebP
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className='border-none shadow-sm'>
						<CardHeader>
							<CardTitle className='text-lg'>
								SEO Settings
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<div className='flex justify-between'>
									<Label>Meta Title</Label>
									<span
										className={`text-xs ${
											formData.seo.metaTitle.length > 60
												? "text-red-500"
												: "text-slate-500"
										}`}>
										{formData.seo.metaTitle.length}/60
									</span>
								</div>
								<Input
									value={formData.seo.metaTitle}
									onChange={(e) =>
										setFormData({
											...formData,
											seo: {
												...formData.seo,
												metaTitle: e.target.value,
											},
										})
									}
									placeholder='SEO Title'
								/>
							</div>

							<div className='space-y-2'>
								<div className='flex justify-between'>
									<Label>Meta Description</Label>
									<span
										className={`text-xs ${
											formData.seo.metaDescription
												.length > 160
												? "text-red-500"
												: "text-slate-500"
										}`}>
										{formData.seo.metaDescription.length}
										/160
									</span>
								</div>
								<Textarea
									value={formData.seo.metaDescription}
									onChange={(e) =>
										setFormData({
											...formData,
											seo: {
												...formData.seo,
												metaDescription: e.target.value,
											},
										})
									}
									placeholder='Brief description for search engines'
									className='resize-none'
									rows={4}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Keywords</Label>
								<Input
									value={formData.seo.keywords}
									onChange={(e) =>
										setFormData({
											...formData,
											seo: {
												...formData.seo,
												keywords: e.target.value,
											},
										})
									}
									placeholder='Comma separated keywords'
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
