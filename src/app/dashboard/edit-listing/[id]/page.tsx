"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { toast } from "sonner";
import { X, Upload, Check, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
	{ id: "website", label: "Website" },
	{ id: "youtube", label: "YouTube Channel" },
	{ id: "facebook", label: "Facebook Page" },
	{ id: "instagram", label: "Instagram Page" },
	{ id: "tiktok", label: "TikTok Account" },
	{ id: "twitter", label: "Twitter Account" },
	{ id: "play-console", label: "Play Console" },
	{ id: "adsense", label: "AdSense Dashboard" },
	{ id: "shopify", label: "Shopify Store" },
	{ id: "dropshipping", label: "Dropshipping Store" },
	{ id: "saas", label: "SaaS" },
	{ id: "mobile-app", label: "Mobile App" },
	{ id: "other", label: "Other" },
];

const steps = [
	{ id: 1, name: "Category" },
	{ id: 2, name: "Details" },
	{ id: 3, name: "Images" },
	{ id: 4, name: "Metrics" },
	{ id: 5, name: "Pricing" },
];

type ListingFormState = {
	title: string;
	description: string;
	category: string;
	price: string;
	thumbnail: string;
	images: string[];
	metrics: {
		monthlyRevenue: string;
		monthlyTraffic: string;
		followers: string;
		subscribers: string;
		engagement: string;
		age: string;
		assetLink: string;
		country: string;
	};
	details: {
		niche: string;
		monetization: string;
		trafficSource: string;
		growthPotential: string;
		paymentReceived: string;
		adManager: string;
		domainProvider: string;
		domainExpiry: string;
		platform: string;
		issue: string;
	};
};

export default function EditListing() {
	const router = useRouter();
	const params = useParams();
	const { user } = userContext();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploadingImages, setUploadingImages] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<ListingFormState>({
		title: "",
		description: "",
		category: "",
		price: "",
		thumbnail: "",
		images: [],
		metrics: {
			monthlyRevenue: "",
			monthlyTraffic: "",
			followers: "",
			subscribers: "",
			engagement: "",
			age: "",
			assetLink: "",
			country: "",
		},
		details: {
			niche: "",
			monetization: "",
			trafficSource: "",
			growthPotential: "",
			paymentReceived: "",
			adManager: "",
			domainProvider: "",
			domainExpiry: "",
			platform: "",
			issue: "",
		},
	});

	// Fetch listing data
	useEffect(() => {
		const fetchListing = async () => {
			try {
				const response = await axios.get(`/api/listings/${params.id}`);
				if (response.data) {
					const listing = response.data;
					// Convert price to string for the form
					const formattedListing = {
						...listing,
						price: listing.price.toString(),
						// Ensure all metrics and details fields are strings
						metrics: {
							monthlyRevenue:
								listing.metrics?.monthlyRevenue?.toString() ||
								"",
							monthlyTraffic:
								listing.metrics?.monthlyTraffic?.toString() ||
								"",
							followers:
								listing.metrics?.followers?.toString() || "",
							subscribers:
								listing.metrics?.subscribers?.toString() || "",
							engagement:
								listing.metrics?.engagement?.toString() || "",
							age: listing.metrics?.age?.toString() || "",
							assetLink: listing.metrics?.assetLink || "",
							country: listing.metrics?.country || "",
						},
						details: {
							niche: listing.details?.niche || "",
							monetization: listing.details?.monetization || "",
							trafficSource: listing.details?.trafficSource || "",
							growthPotential:
								listing.details?.growthPotential || "",
							paymentReceived:
								listing.details?.paymentReceived || "",
							adManager: listing.details?.adManager || "",
							domainProvider:
								listing.details?.domainProvider || "",
							domainExpiry: listing.details?.domainExpiry || "",
							platform: listing.details?.platform || "",
							issue: listing.details?.issue || "",
						},
					};
					setFormData(formattedListing);
				}
			} catch (error) {
				console.error("Failed to fetch listing:", error);
				toast.error("Failed to load listing. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			fetchListing();
		}
	}, [params.id]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleMetricsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			metrics: {
				...prev.metrics,
				[name]: value,
			},
		}));
	};

	const handleDetailsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			details: {
				...prev.details,
				[name]: value,
			},
		}));
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		isThumbnail = false
	) => {
		const files = Array.from((e.target.files as FileList) || []);
		if (files.length === 0) return;

		if (!isThumbnail && formData.images.length + files.length > 6) {
			toast.error(
				`Maximum 6 images allowed. You already have ${formData.images.length} images.`
			);
			e.target.value = "";
			return;
		}

		setUploadingImages(true);

		try {
			const uploadPromises = files.map(async (file) => {
				try {
					const authRes = await fetch("/api/imagekit/auth");
					if (!authRes.ok) {
						throw new Error("Failed to get ImageKit auth");
					}
					const { token, expire, signature, publicKey } =
						await authRes.json();

					const form = new FormData();
					form.append("file", file);
					form.append("fileName", file.name);
					form.append("publicKey", publicKey);
					form.append("signature", signature);
					form.append("expire", String(expire));
					form.append("token", token);
					form.append("useUniqueFileName", "true");

					const uploadRes = await fetch(
						"https://upload.imagekit.io/api/v1/files/upload",
						{ method: "POST", body: form }
					);

					if (!uploadRes.ok) {
						const errorData = await uploadRes
							.json()
							.catch(() => ({}));
						throw new Error(
							errorData.message || `Failed to upload ${file.name}`
						);
					}

					const data = await uploadRes.json();
					if (data && data.url) {
						return {
							success: true,
							url: data.url,
							fileName: file.name,
						};
					}
					throw new Error(`No URL returned for ${file.name}`);
				} catch (error: any) {
					console.error(`Upload failed for ${file.name}:`, error);
					return {
						success: false,
						fileName: file.name,
						error: error.message,
					};
				}
			});

			const results = await Promise.allSettled(uploadPromises);

			const successfulUploads: string[] = [];
			const failedUploads: string[] = [];

			results.forEach((result, index) => {
				if (result.status === "fulfilled" && result.value.success) {
					successfulUploads.push(result.value.url);
				} else {
					const fileName =
						result.status === "fulfilled"
							? result.value.fileName
							: files[index]?.name || `File ${index + 1}`;
					failedUploads.push(fileName);
				}
			});

			if (successfulUploads.length === 0) {
				throw new Error(
					"No images were uploaded successfully. Please try again."
				);
			}

			if (failedUploads.length > 0) {
				toast.warning(
					`${successfulUploads.length} uploaded, ${failedUploads.length} failed`
				);
			}

			if (isThumbnail && successfulUploads.length > 0) {
				setFormData((prev) => ({
					...prev,
					thumbnail: successfulUploads[0],
				}));
				toast.success("Thumbnail updated successfully!");
			} else if (successfulUploads.length > 0) {
				setFormData((prev) => ({
					...prev,
					images: [...prev.images, ...successfulUploads],
				}));
				toast.success(
					`${successfulUploads.length} image(s) uploaded successfully!`
				);
			}

			e.target.value = "";
		} catch (error: any) {
			console.error("Upload failed:", error);
			toast.error(
				error?.message || "Failed to upload images. Please try again."
			);
		} finally {
			setUploadingImages(false);
		}
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const removeThumbnail = () => {
		setFormData((prev) => ({
			...prev,
			thumbnail: "",
		}));
	};

	const nextStep = () => {
		if (currentStep === 1 && !formData.category) {
			toast.error("Please select a category");
			return;
		}
		if (currentStep === 2 && (!formData.title || !formData.description)) {
			toast.error("Please fill in all required fields");
			return;
		}
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
			return;
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		} else {
			router.back();
		}
	};

	const selectCategory = (categoryId: string) => {
		const category = categories.find((c) => c.id === categoryId);
		if (category) {
			setFormData((prev) => ({ ...prev, category: category.label }));
			nextStep();
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Don't submit if not on the last step
		if (currentStep < steps.length) {
			nextStep();
			return;
		}

		setSaving(true);
		if (!user) {
			toast.error("User not found!");
			setSaving(false);
			return;
		}

		try {
			const response = await axios.put(`/api/listings/${params.id}`, {
				...formData,
				price: Number.parseFloat(formData.price),
				userId: user?._id,
			});

			if (response.data.success) {
				toast.success(
					response.data.message || "Listing updated successfully!"
				);
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Failed to update listing:", error);
			toast.error("Failed to update listing. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8'>
			<div className='max-w-5xl mx-auto'>
				<Card className='bg-white border-0 shadow-xl'>
					<CardHeader className='border-b pb-6'>
						<div className='flex items-center gap-4 mb-4'>
							<Button
								variant='ghost'
								size='icon'
								onClick={prevStep}>
								<ArrowLeft className='h-5 w-5' />
							</Button>
							<CardTitle className='text-3xl font-bold text-gray-900'>
								Edit Listing
							</CardTitle>
						</div>

						{/* Stepper */}
						<div className='mt-4'>
							<div className='max-w-3xl mx-auto'>
								{/* Step circles and lines */}
								<div className='flex items-center mb-3'>
									{steps.map((step, index) => (
										<div
											key={step.id}
											className='flex items-center flex-1'>
											<div className='flex items-center w-full'>
												{/* Left line */}
												{index > 0 && (
													<div
														className={cn(
															"flex-1 h-0.5 min-w-[20px]",
															currentStep >
																step.id - 1
																? "bg-blue-500"
																: "bg-gray-300"
														)}
													/>
												)}
												{/* Circle */}
												<div
													className={cn(
														"w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm transition-all",
														currentStep === step.id
															? "bg-blue-500 text-white scale-110"
															: currentStep >
															  step.id
															? "bg-blue-500 text-white"
															: "bg-gray-200 text-gray-500"
													)}>
													{currentStep > step.id ? (
														<Check className='w-5 h-5' />
													) : (
														step.id
													)}
												</div>
												{/* Right line - only if not the last step */}
												{index < steps.length - 1 && (
													<div
														className={cn(
															"flex-1 h-0.5 min-w-[20px]",
															currentStep >
																step.id
																? "bg-blue-500"
																: "bg-gray-300"
														)}
													/>
												)}
											</div>
										</div>
									))}
								</div>
								{/* Step names */}
								<div className='flex justify-between'>
									{steps.map((step) => (
										<div
											key={step.id}
											className={cn(
												"text-xs font-medium text-center flex-1 min-w-0 px-1",
												currentStep === step.id
													? "text-blue-600 font-semibold"
													: currentStep > step.id
													? "text-blue-500"
													: "text-gray-500"
											)}>
											<span className='whitespace-nowrap'>
												{step.name}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</CardHeader>

					<CardContent className='p-6'>
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Step 1: Category Selection */}
							{currentStep === 1 && (
								<div className='space-y-4'>
									<h3 className='text-lg font-medium'>
										Select a Category
									</h3>
									<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
										{categories.map((category) => (
											<button
												key={category.id}
												type='button'
												onClick={() =>
													selectCategory(category.id)
												}
												className={cn(
													"p-4 border rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors",
													formData.category ===
														category.label
														? "border-blue-500 bg-blue-50"
														: "border-gray-200"
												)}>
												{category.label}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Step 2: Basic Details */}
							{currentStep === 2 && (
								<div className='space-y-6'>
									<h3 className='text-lg font-medium'>
										Listing Details
									</h3>
									<div className='space-y-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Title *
											</label>
											<Input
												name='title'
												value={formData.title}
												onChange={handleChange}
												placeholder='Enter listing title'
												required
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Description *
											</label>
											<textarea
												name='description'
												value={formData.description}
												onChange={handleChange}
												rows={5}
												className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
												placeholder='Describe your listing in detail'
												required
											/>
										</div>
									</div>
								</div>
							)}

							{/* Step 3: Images */}
							{currentStep === 3 && (
								<div className='space-y-6'>
									<h3 className='text-lg font-medium'>
										Images
									</h3>
									<div className='space-y-6'>
										{/* Thumbnail */}
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Thumbnail Image *
											</label>
											{formData.thumbnail ? (
												<div className='relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden'>
													<img
														src={formData.thumbnail}
														alt='Thumbnail'
														className='w-full h-full object-cover'
													/>
													<button
														type='button'
														onClick={
															removeThumbnail
														}
														className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'>
														<X className='h-4 w-4' />
													</button>
												</div>
											) : (
												<label className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors'>
													<Upload className='h-10 w-10 text-gray-400 mb-2' />
													<span className='text-sm text-gray-600'>
														Click to upload
														thumbnail
													</span>
													<input
														type='file'
														className='hidden'
														accept='image/*'
														onChange={(e) =>
															handleImageUpload(
																e,
																true
															)
														}
													/>
												</label>
											)}
											<p className='mt-1 text-xs text-gray-500'>
												This will be the main image for
												your listing
											</p>
										</div>

										{/* Additional Images */}
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Additional Images (Max 6)
											</label>
											<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
												{formData.images.map(
													(image, index) => (
														<div
															key={index}
															className='relative aspect-square border rounded-lg overflow-hidden'>
															<img
																src={image}
																alt={`Listing ${
																	index + 1
																}`}
																className='w-full h-full object-cover'
															/>
															<button
																type='button'
																onClick={() =>
																	removeImage(
																		index
																	)
																}
																className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'>
																<X className='h-3 w-3' />
															</button>
														</div>
													)
												)}
												{formData.images.length < 6 && (
													<label className='flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors'>
														<Upload className='h-8 w-8 text-gray-400 mb-1' />
														<span className='text-xs text-gray-600 text-center px-2'>
															Add more images
														</span>
														<input
															type='file'
															className='hidden'
															accept='image/*'
															multiple
															onChange={
																handleImageUpload
															}
														/>
													</label>
												)}
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Step 4: Metrics */}
							{currentStep === 4 && (
								<div className='space-y-6'>
									<h3 className='text-lg font-medium'>
										Metrics
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Monthly Revenue ($)
											</label>
											<Input
												type='number'
												name='monthlyRevenue'
												value={
													formData.metrics
														.monthlyRevenue
												}
												onChange={handleMetricsChange}
												placeholder='e.g. 1000'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Monthly Traffic
											</label>
											<Input
												type='number'
												name='monthlyTraffic'
												value={
													formData.metrics
														.monthlyTraffic
												}
												onChange={handleMetricsChange}
												placeholder='e.g. 50000'
											/>
										</div>
										{hasFollowers(formData.category) && (
											<>
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-1'>
														Followers/Subscribers
													</label>
													<Input
														type='number'
														name='followers'
														value={
															formData.metrics
																.followers
														}
														onChange={
															handleMetricsChange
														}
														placeholder='e.g. 10000'
													/>
												</div>
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-1'>
														Engagement Rate (%)
													</label>
													<Input
														type='number'
														name='engagement'
														value={
															formData.metrics
																.engagement
														}
														onChange={
															handleMetricsChange
														}
														placeholder='e.g. 2.5'
														step='0.1'
													/>
												</div>
											</>
										)}
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Asset Age (months)
											</label>
											<Input
												type='number'
												name='age'
												value={formData.metrics.age}
												onChange={handleMetricsChange}
												placeholder='e.g. 12'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Asset URL
											</label>
											<Input
												type='url'
												name='assetLink'
												value={
													formData.metrics.assetLink
												}
												onChange={handleMetricsChange}
												placeholder='https://example.com'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Country
											</label>
											<Input
												type='text'
												name='country'
												value={formData.metrics.country}
												onChange={handleMetricsChange}
												placeholder='e.g. United States'
											/>
										</div>
									</div>
								</div>
							)}

							{/* Step 5: Pricing */}
							{currentStep === 5 && (
								<div className='space-y-6'>
									<h3 className='text-lg font-medium'>
										Pricing
									</h3>
									<div className='space-y-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Price ($) *
											</label>
											<Input
												type='number'
												name='price'
												value={formData.price}
												onChange={handleChange}
												placeholder='e.g. 10000'
												required
											/>
										</div>
										<div className='p-4 bg-blue-50 rounded-lg'>
											<h4 className='font-medium text-blue-800 mb-2'>
												Additional Details
											</h4>
											<div className='space-y-3'>
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-1'>
														Niche
													</label>
													<Input
														name='niche'
														value={
															formData.details
																.niche
														}
														onChange={
															handleDetailsChange
														}
														placeholder='e.g. Technology, Fashion, Gaming'
													/>
												</div>
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-1'>
														Monetization Method
													</label>
													<Input
														name='monetization'
														value={
															formData.details
																.monetization
														}
														onChange={
															handleDetailsChange
														}
														placeholder='e.g. AdSense, Affiliate, Dropshipping'
													/>
												</div>
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-1'>
														Traffic Source
													</label>
													<Input
														name='trafficSource'
														value={
															formData.details
																.trafficSource
														}
														onChange={
															handleDetailsChange
														}
														placeholder='e.g. Organic, Social Media, Paid Ads'
													/>
												</div>
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-1'>
														Growth Potential
													</label>
													<textarea
														name='growthPotential'
														value={
															formData.details
																.growthPotential
														}
														onChange={
															handleDetailsChange
														}
														rows={3}
														className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
														placeholder='Describe the growth potential of this asset'
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className='flex justify-between pt-6 border-t'>
								<div>
									{currentStep > 1 && (
										<Button
											type='button'
											variant='outline'
											onClick={prevStep}
											disabled={saving}>
											Back
										</Button>
									)}
								</div>
								<div className='flex gap-2'>
									{currentStep < steps.length ? (
										<Button
											type='submit'
											disabled={saving || uploadingImages}
											className='bg-blue-600 hover:bg-blue-700'>
											{uploadingImages ? (
												<>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													Uploading...
												</>
											) : (
												"Next Step"
											)}
										</Button>
									) : (
										<Button
											type='submit'
											disabled={saving || uploadingImages}
											className='bg-green-600 hover:bg-green-700'>
											{saving ? (
												<>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													Updating...
												</>
											) : (
												"Update Listing"
											)}
										</Button>
									)}
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// Helper function to check if the category has followers
function hasFollowers(category: string): boolean {
	const followersCategories = [
		"YouTube Channel",
		"Facebook Page",
		"Instagram Page",
		"Twitter Account",
		"TikTok Account",
	];
	return followersCategories.includes(category);
}
