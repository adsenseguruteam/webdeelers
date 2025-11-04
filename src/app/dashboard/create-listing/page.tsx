"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { toast } from "sonner";
import { X, Upload, Check, Loader2 } from "lucide-react";
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

export default function CreateListing() {
	const router = useRouter();
	const { user } = userContext();
	const [loading, setLoading] = useState(false);
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
				toast.success("Thumbnail uploaded successfully!");
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

	const removeImage = (index: any) => {
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
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const selectCategory = (categoryId: string) => {
		const category = categories.find((c) => c.id === categoryId);
		if (category) {
			setFormData((prev) => ({ ...prev, category: category.label }));
		}
	};

	// Categories that have followers/subscribers
	const hasFollowers = () => {
		const followersCategories = [
			"YouTube Channel",
			"Facebook Page",
			"Instagram Page",
			"Twitter Account",
			"TikTok Account",
		];
		return followersCategories.includes(formData.category);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Only submit if on the last step
		if (currentStep < steps.length) {
			nextStep();
			return;
		}

		setLoading(true);
		if (!user) {
			toast.error("User not found!");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post("/api/listings", {
				...formData,
				price: Number.parseFloat(formData.price),
				userId: user?._id,
			});

			if (response.data.success) {
				setLoading(false);
				toast.success(response.data.message || "Listing successfull!");
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Failed to create listing:", error);
			toast.error("Failed to create listing. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8'>
			<div className='max-w-5xl mx-auto'>
				<Card className='bg-white border-0 shadow-xl'>
					<CardHeader className='border-b pb-6'>
						<CardTitle className='text-3xl font-bold text-center text-gray-900'>
							List Your Product
						</CardTitle>

						{/* Stepper */}
						<div className='mt-8'>
							<div className='max-w-3xl mx-auto'>
								{/* Step circles and lines */}
								<div className='flex items-center justify-between mb-3'>
									{steps.map((step, index) => (
										<div
											key={step.id}
											className='flex items-center flex-1'>
											<div className='flex items-center w-full'>
												{/* Left line */}
												{index > 0 && (
													<div
														className={cn(
															"flex-1 h-0.5",
															currentStep >
																step.id - 1
																? "bg-red-500"
																: "bg-gray-300"
														)}
													/>
												)}
												{/* Circle */}
												<div
													className={cn(
														"w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all mx-2",
														currentStep === step.id
															? "bg-red-500 text-white scale-110"
															: currentStep >
															  step.id
															? "bg-red-500 text-white"
															: "bg-gray-200 text-gray-500"
													)}>
													{currentStep > step.id ? (
														<Check className='w-5 h-5' />
													) : (
														step.id
													)}
												</div>
												{/* Right line */}
												{index < steps.length - 1 && (
													<div
														className={cn(
															"flex-1 h-0.5",
															currentStep >
																step.id
																? "bg-red-500"
																: "bg-gray-300"
														)}
													/>
												)}
											</div>
										</div>
									))}
								</div>
								{/* Step labels */}
								<div className='flex items-center justify-between'>
									{steps.map((step) => (
										<div
											key={step.id}
											className='flex-1 text-center'>
											<span
												className={cn(
													"text-xs font-medium",
													currentStep === step.id
														? "text-red-500"
														: currentStep > step.id
														? "text-gray-700"
														: "text-gray-400"
												)}>
												{step.name}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className='p-8'>
						<form onSubmit={handleSubmit} className='space-y-8'>
							{/* Step 1: Category */}
							{currentStep === 1 && (
								<div className='space-y-6'>
									<div>
										<h2 className='text-2xl font-bold text-gray-900 mb-2'>
											Category
										</h2>
										<p className='text-gray-600'>
											Select the category that best fits
											your product.
										</p>
									</div>

									<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
										{categories.map((category) => (
											<button
												key={category.id}
												type='button'
												onClick={() =>
													selectCategory(category.id)
												}
												className={cn(
													"p-4 border-2 rounded-lg text-center font-medium transition-all hover:border-gray-400 hover:shadow-md",
													formData.category ===
														category.label
														? "border-red-500 bg-red-50 text-red-700"
														: "border-gray-200 bg-white text-gray-700"
												)}>
												{category.label}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Step 2: Details */}
							{currentStep === 2 && (
								<div className='space-y-6'>
									<div>
										<h2 className='text-2xl font-bold text-gray-900 mb-2'>
											Details
										</h2>
										<p className='text-gray-600'>
											Provide basic information about your
											product.
										</p>
									</div>

									<div className='space-y-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Title
											</label>
											<Input
												name='title'
												value={formData.title}
												onChange={handleChange}
												placeholder='e.g., High-Traffic Tech Blog'
												className='bg-white border-gray-300'
												required
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Description
											</label>
											<textarea
												name='description'
												value={formData.description}
												onChange={(
													e: React.ChangeEvent<HTMLTextAreaElement>
												) => handleChange(e)}
												placeholder='Describe your asset in detail...'
												className='w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
												rows={5}
												required
											/>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Link/URL
												</label>
												<Input
													name='assetLink'
													type='text'
													value={
														formData.metrics
															.assetLink
													}
													onChange={
														handleMetricsChange
													}
													placeholder='https://example.com'
													className='bg-white border-gray-300'
												/>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Country
												</label>
												<Input
													name='country'
													type='text'
													value={
														formData.metrics.country
													}
													onChange={
														handleMetricsChange
													}
													placeholder='Country....'
													className='bg-white border-gray-300'
												/>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Step 3: Images */}
							{currentStep === 3 && (
								<div className='space-y-6'>
									<div>
										<h2 className='text-2xl font-bold text-gray-900 mb-2'>
											Images
										</h2>
										<p className='text-gray-600'>
											Upload images to showcase your
											product.
										</p>
									</div>

									<div className='space-y-4'>
										{/* Thumbnail Upload */}
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Thumbnail Image
											</label>
											<div className='flex items-center gap-4'>
												<label
													className={cn(
														"flex-1 flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition",
														uploadingImages
															? "border-red-500 bg-red-50 cursor-not-allowed"
															: "border-gray-300 cursor-pointer hover:border-red-500"
													)}>
													<div className='text-center'>
														{uploadingImages ? (
															<>
																<Loader2 className='w-6 h-6 text-red-500 mx-auto mb-2 animate-spin' />
																<span className='text-sm text-red-600 font-medium'>
																	Uploading...
																</span>
															</>
														) : (
															<>
																<Upload className='w-6 h-6 text-gray-400 mx-auto mb-2' />
																<span className='text-sm text-gray-500'>
																	Click to
																	upload
																	thumbnail
																</span>
															</>
														)}
													</div>
													<input
														type='file'
														accept='image/*'
														onChange={(e) =>
															handleImageUpload(
																e,
																true
															)
														}
														disabled={
															uploadingImages
														}
														className='hidden'
													/>
												</label>
												{formData.thumbnail && (
													<div className='relative w-24 h-24'>
														<img
															src={
																formData.thumbnail ||
																"/placeholder.svg"
															}
															alt='Thumbnail'
															className='w-full h-full object-cover rounded-lg'
														/>
														<button
															type='button'
															onClick={
																removeThumbnail
															}
															className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600'>
															<X className='w-4 h-4 text-white' />
														</button>
													</div>
												)}
											</div>
										</div>

										{/* Additional Images Upload */}
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Additional Images (up to 6)
											</label>
											<label
												className={cn(
													"flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition",
													uploadingImages
														? "border-red-500 bg-red-50 cursor-not-allowed"
														: formData.images
																.length >= 6
														? "border-gray-300 bg-gray-50 cursor-not-allowed"
														: "border-gray-300 cursor-pointer hover:border-red-500"
												)}>
												<div className='text-center'>
													{uploadingImages ? (
														<>
															<Loader2 className='w-6 h-6 text-red-500 mx-auto mb-2 animate-spin' />
															<span className='text-sm text-red-600 font-medium'>
																Uploading...
															</span>
														</>
													) : (
														<>
															<Upload className='w-6 h-6 text-gray-400 mx-auto mb-2' />
															<span className='text-sm text-gray-500'>
																Click to upload
																images (
																{
																	formData
																		.images
																		.length
																}
																/6)
															</span>
														</>
													)}
												</div>
												<input
													type='file'
													accept='image/*'
													multiple
													onChange={(e) =>
														handleImageUpload(
															e,
															false
														)
													}
													disabled={
														uploadingImages ||
														formData.images
															.length >= 6
													}
													className='hidden'
												/>
											</label>

											{/* Image Preview Grid */}
											{formData.images.length > 0 && (
												<div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
													{formData.images.map(
														(image, index) => (
															<div
																key={index}
																className='relative group'>
																<img
																	src={
																		image ||
																		"/placeholder.svg"
																	}
																	alt={`Image ${
																		index +
																		1
																	}`}
																	className='w-full h-32 object-cover rounded-lg'
																/>
																<button
																	type='button'
																	onClick={() =>
																		removeImage(
																			index
																		)
																	}
																	className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition'>
																	<X className='w-4 h-4 text-white' />
																</button>
															</div>
														)
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Step 4: Metrics */}
							{currentStep === 4 && (
								<div className='space-y-6'>
									<div>
										<h2 className='text-2xl font-bold text-gray-900 mb-2'>
											Metrics
										</h2>
										<p className='text-gray-600'>
											Provide performance metrics for your
											product.
										</p>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Monthly Revenue ($)
											</label>
											<Input
												name='monthlyRevenue'
												type='number'
												value={
													formData.metrics
														.monthlyRevenue
												}
												onChange={handleMetricsChange}
												placeholder='0'
												className='bg-white border-gray-300'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Monthly Traffic/Reach
											</label>
											<Input
												name='monthlyTraffic'
												type='number'
												value={
													formData.metrics
														.monthlyTraffic
												}
												onChange={handleMetricsChange}
												placeholder='0'
												className='bg-white border-gray-300'
											/>
										</div>

										{hasFollowers() && (
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Followers/Subscribers
												</label>
												<Input
													name='followers'
													type='number'
													value={
														formData.metrics
															.followers
													}
													onChange={
														handleMetricsChange
													}
													placeholder='0'
													className='bg-white border-gray-300'
												/>
											</div>
										)}

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Age (months)
											</label>
											<Input
												name='age'
												type='number'
												value={formData.metrics.age}
												onChange={handleMetricsChange}
												placeholder='0'
												className='bg-white border-gray-300'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Niche
											</label>
											<Input
												name='niche'
												value={formData.details.niche}
												onChange={handleDetailsChange}
												placeholder='e.g., Technology, Finance'
												className='bg-white border-gray-300'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Monetization
											</label>
											<Input
												name='monetization'
												value={
													formData.details
														.monetization
												}
												onChange={handleDetailsChange}
												placeholder='e.g., AdSense, Sponsorships'
												className='bg-white border-gray-300'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Traffic Source
											</label>
											<Input
												name='trafficSource'
												value={
													formData.details
														.trafficSource
												}
												onChange={handleDetailsChange}
												placeholder='e.g., Organic, Paid'
												className='bg-white border-gray-300'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Growth Potential
											</label>
											<Input
												name='growthPotential'
												value={
													formData.details
														.growthPotential
												}
												onChange={handleDetailsChange}
												placeholder='e.g., High, Medium, Low'
												className='bg-white border-gray-300'
											/>
										</div>
									</div>
								</div>
							)}

							{/* Step 5: Pricing */}
							{currentStep === 5 && (
								<div className='space-y-6'>
									<div>
										<h2 className='text-2xl font-bold text-gray-900 mb-2'>
											Pricing
										</h2>
										<p className='text-gray-600'>
											Set your price and provide
											additional details.
										</p>
									</div>

									<div className='space-y-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Price ($)
											</label>
											<Input
												name='price'
												type='number'
												value={formData.price}
												onChange={handleChange}
												placeholder='0.00'
												className='bg-white border-gray-300'
												required
											/>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Payment Received
												</label>
												<Input
													name='paymentReceived'
													value={
														formData.details
															.paymentReceived
													}
													onChange={
														handleDetailsChange
													}
													placeholder='e.g., 1, 2, 3'
													className='bg-white border-gray-300'
												/>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Ad Manager Used (Yes/No)
												</label>
												<Input
													name='adManager'
													value={
														formData.details
															.adManager
													}
													onChange={
														handleDetailsChange
													}
													placeholder='e.g., Yes/No'
													className='bg-white border-gray-300'
												/>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Domain Provider
												</label>
												<Input
													name='domainProvider'
													value={
														formData.details
															.domainProvider
													}
													onChange={
														handleDetailsChange
													}
													placeholder='e.g., Godaddy, Namecheap...'
													className='bg-white border-gray-300'
												/>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Domain Expiry
												</label>
												<Input
													name='domainExpiry'
													value={
														formData.details
															.domainExpiry
													}
													onChange={
														handleDetailsChange
													}
													placeholder='e.g., Expiry date...'
													className='bg-white border-gray-300'
												/>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Platform
												</label>
												<Input
													name='platform'
													value={
														formData.details
															.platform
													}
													onChange={
														handleDetailsChange
													}
													placeholder='e.g., WordPress, Blogger...'
													className='bg-white border-gray-300'
												/>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Any Issue (Limit/Policy)
												</label>
												<Input
													name='issue'
													value={
														formData.details.issue
													}
													onChange={
														handleDetailsChange
													}
													placeholder='e.g., Limit, Policy Issue...'
													className='bg-white border-gray-300'
												/>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className='flex justify-between pt-6 border-t'>
								<Button
									type='button'
									variant='outline'
									onClick={prevStep}
									disabled={currentStep === 1}
									className='border-gray-300 text-gray-700 hover:bg-gray-50'>
									Previous
								</Button>
								{currentStep < steps.length ? (
									<Button
										type='button'
										onClick={nextStep}
										className='bg-black text-white hover:bg-gray-800'>
										Next
									</Button>
								) : (
									<Button
										type='submit'
										disabled={loading || uploadingImages}
										className='bg-black text-white hover:bg-gray-800'>
										{loading
											? "Creating..."
											: uploadingImages
											? "Uploading..."
											: "Create Listing"}
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
