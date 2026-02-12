"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	ShoppingCart,
	Star,
	Package,
	CheckCircle,
	ArrowLeft,
	Heart,
	Shield,
	Zap,
	Download,
	ExternalLink,
	Loader2,
	Check,
	AlertCircle,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { getUserCurrency, convertPrice, formatPrice } from "@/lib/currencyUtils";

interface Product {
	_id: string;
	title: string;
	slug: string;
	description: string;
	shortDescription?: string;
	category: string;
	price: number;
	comparePrice?: number;
	currency: string;
	thumbnail?: string;
	images: string[];
	status: string;
	stock: number;
	salesCount: number;
	rating: {
		average: number;
		count: number;
	};
	features: string[];
	requirements: string[];
	tags: string[];
	demoUrl?: string;
	videoUrl?: string;
	isFeatured: boolean;
	isBestseller: boolean;
	faqs?: { question: string; answer: string }[];
	metadata?: {
		documentation?: string;
		supportInfo?: string;
		version?: string;
	};
}

export default function ProductDetailPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { user } = userContext();
	
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [isBuying, setIsBuying] = useState(false);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [orderData, setOrderData] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
	const [userCurrency, setUserCurrency] = useState<string>("USD"); // Default to USD
	const [displayPrice, setDisplayPrice] = useState<number>(0);
	const [displayComparePrice, setDisplayComparePrice] = useState<number | undefined>(undefined);

	useEffect(() => {
		// Fetch user's currency
		const fetchUserCurrency = async () => {
			try {
				const currency = await getUserCurrency();
				setUserCurrency(currency);
			} catch (error) {
				console.error("Error fetching user currency:", error);
				// Default to USD on error
				setUserCurrency("USD");
			}
		};

		fetchUserCurrency();
		fetchProduct();
	}, [slug]);

	const fetchProduct = async () => {
		try {
			setLoading(true);
			// Fetch all products and find by slug
			const response = await axios.get("/api/products?limit=1000&status=");
			const products = response.data.products || [];
			const foundProduct = products.find((p: Product) => p.slug === slug);
			
			if (foundProduct) {
				setProduct(foundProduct);
			} else {
				toast.error("Product not found");
			}
		} catch (error) {
			console.error("Error fetching product:", error);
			toast.error("Failed to load product");
		} finally {
			setLoading(false);
		}
	};
	
	// Update display prices when product or user currency changes
	useEffect(() => {
		if (product) {
			// Calculate display prices based on user's currency
			const originalPrice = product.price;
			const originalComparePrice = product.comparePrice;
			
			// Convert prices to user's currency
			const convertedPrice = convertPrice(originalPrice, product.currency, userCurrency);
			setDisplayPrice(convertedPrice);
			
			if (originalComparePrice && originalComparePrice > 0) {
				const convertedComparePrice = convertPrice(originalComparePrice, product.currency, userCurrency);
				setDisplayComparePrice(convertedComparePrice);
			} else {
				setDisplayComparePrice(undefined);
			}
		}
	}, [product, userCurrency]);

	const handleBuy = async () => {
		if (!user) {
			toast.error("Please login to purchase");
			return;
		}

		if (!product) return;

		try {
			setIsBuying(true);
			
			// Create Razorpay order
			const response = await axios.post("/api/payments/razorpay/create-order", {
				productId: product._id,
				customerDetails: {
					name: user.name,
					email: user.email,
					phone: user.phone || "",
				},
				currency: userCurrency, // Send user's currency
			});

			if (response.data.success) {
				setOrderData(response.data);
				setShowPaymentDialog(true);
				
				// Load Razorpay script and open checkout
				loadRazorpayScript(() => {
					openRazorpayCheckout(response.data);
				});
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to initiate purchase");
		} finally {
			setIsBuying(false);
		}
	};

	const loadRazorpayScript = (callback: () => void) => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = callback;
		script.onerror = () => {
			toast.error("Failed to load payment gateway");
		};
		document.body.appendChild(script);
	};

	const openRazorpayCheckout = (data: any) => {
		const { razorpay, order } = data;
		
		const options = {
			key: razorpay.keyId,
			amount: razorpay.amount,
			currency: razorpay.currency,
			name: "Deelzo",
			description: order.title || "Product Purchase",
			order_id: razorpay.orderId,
			handler: async function (response: any) {
				await verifyPayment(response, order.id);
			},
			prefill: {
				name: user?.name || "",
				email: user?.email || "",
				contact: user?.phone || "",
			},
			theme: {
				color: "#f97316",
			},
			modal: {
				ondismiss: function() {
					setPaymentStatus("idle");
				},
			},
		};

		const rzp = new (window as any).Razorpay(options);
		rzp.open();
		setPaymentStatus("processing");
	};

	const verifyPayment = async (razorpayResponse: any, orderId: string) => {
		try {
			setPaymentStatus("processing");
			
			const response = await axios.post("/api/payments/razorpay/verify", {
				razorpay_order_id: razorpayResponse.razorpay_order_id,
				razorpay_payment_id: razorpayResponse.razorpay_payment_id,
				razorpay_signature: razorpayResponse.razorpay_signature,
				orderId: orderId,
			});

			if (response.data.success) {
				setPaymentStatus("success");
				toast.success("Payment successful! Your order has been placed.");
				setShowPaymentDialog(false);
				// Redirect to orders page
				window.location.href = "/dashboard/orders";
			} else {
				setPaymentStatus("failed");
				toast.error("Payment verification failed");
			}
		} catch (error: any) {
			setPaymentStatus("failed");
			toast.error(error.response?.data?.message || "Payment verification failed");
		}
	};

	const discount = product?.comparePrice && product.comparePrice > product.price
		? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
		: 0;

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
				<Loader2 className="animate-spin text-orange-500" size={48} />
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
				<div className="text-center">
					<Package size={64} className="mx-auto mb-4 text-slate-300" />
					<h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
					<p className="text-slate-500 mb-6">The product you're looking for doesn't exist.</p>
					<Link href="/shop">
						<Button className="bg-gradient-to-r from-orange-500 to-rose-500">
							<ArrowLeft size={18} className="mr-2" />
							Back to Shop
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
			{/* Breadcrumb */}
			<div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
					<div className="flex items-center gap-2 text-sm">
						<Link href="/" className="text-slate-500 hover:text-orange-600 transition-colors">Home</Link>
						<span className="text-slate-300">/</span>
						<Link href="/shop" className="text-slate-500 hover:text-orange-600 transition-colors">Shop</Link>
						<span className="text-slate-300">/</span>
						<span className="text-slate-900 font-medium truncate">{product.title}</span>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Left: Images */}
					<div className="space-y-4">
						<div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg">
							{product.thumbnail || product.images[selectedImage] ? (
								<img
									src={product.thumbnail || product.images[selectedImage]}
									alt={product.title}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Package size={80} className="text-slate-300" />
								</div>
							)}
							
							{/* Badges */}
							<div className="absolute top-4 left-4 flex flex-col gap-2">
								{discount > 0 && (
									<Badge className="bg-rose-500 text-white border-0 px-3 py-1 text-sm">
										-{discount}% OFF
									</Badge>
								)}
								{product.isBestseller && (
									<Badge className="bg-amber-500 text-white border-0 px-3 py-1 text-sm">
										Bestseller
									</Badge>
								)}
							</div>
						</div>
						
						{/* Thumbnail Gallery */}
						{product.images.length > 0 && (
							<div className="flex gap-3 overflow-x-auto pb-2">
								{product.images.map((img, idx) => (
									<button
										key={idx}
										onClick={() => setSelectedImage(idx)}
										className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
											selectedImage === idx ? "border-orange-500" : "border-transparent"
										}`}
									>
										<img src={img} alt="" className="w-full h-full object-cover" />
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right: Product Info */}
					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-3 mb-3">
								<Badge variant="outline" className="text-slate-600 border-slate-300 capitalize">
									{product.category}
								</Badge>
							</div>
							
							<h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
								{product.title}
							</h1>
							
							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={18}
											className={i < Math.round(product.rating?.average || 0) ? "text-amber-400 fill-amber-400" : "text-slate-300"}
										/>
									))}
									<span className="ml-2 text-slate-600">
										{product.rating?.average?.toFixed(1) || "0.0"} ({product.rating?.count || 0} reviews)
									</span>
								</div>
								<span className="text-slate-300">|</span>
								<span className="text-slate-600">{product.salesCount || 0} sold</span>
							</div>
							
							<p className="text-slate-600 text-lg leading-relaxed">
								{product.shortDescription || product.description}
							</p>
						</div>

						{/* Price */}
						<div className="flex items-baseline gap-4 p-6 bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl border border-orange-100">
							<span className="text-4xl font-bold text-slate-900">
								{userCurrency} {displayPrice.toFixed(2)}
							</span>
							{displayComparePrice && displayComparePrice > displayPrice && (
								<>
									<span className="text-xl text-slate-400 line-through">
										{userCurrency} {displayComparePrice.toFixed(2)}
									</span>
									<Badge className="bg-rose-500 text-white">
										Save {userCurrency} {(displayComparePrice - displayPrice).toFixed(2)}
									</Badge>
								</>
							)}
						</div>

						{/* Actions */}
						<div className="flex gap-3">
							<Button
								onClick={handleBuy}
								disabled={isBuying || product.status !== "active"}
								className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white py-6 text-lg font-semibold shadow-lg shadow-orange-500/25 rounded-xl"
							>
								{isBuying ? (
									<Loader2 className="animate-spin mr-2" size={20} />
								) : (
									<ShoppingCart className="mr-2" size={20} />
								)}
								{product.status === "active" ? "Buy Now" : "Unavailable"}
							</Button>
							
							{product.demoUrl && (
								<Link href={product.demoUrl} target="_blank">
									<Button variant="outline" className="py-6 px-6 rounded-xl border-2">
										<ExternalLink size={20} />
									</Button>
								</Link>
							)}
							
							<Button variant="outline" className="py-6 px-6 rounded-xl border-2">
								<Heart size={20} />
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="grid grid-cols-3 gap-4">
							<div className="flex items-center gap-2 text-sm text-slate-600">
								<Shield size={18} className="text-emerald-500" />
								<span>Secure Payment</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-slate-600">
								<Download size={18} className="text-blue-500" />
								<span>Instant Download</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-slate-600">
								<Zap size={18} className="text-amber-500" />
								<span>Lifetime Access</span>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<div className="mt-12">
					<Tabs defaultValue="description" className="w-full">
						<TabsList className="w-full justify-start bg-slate-100 p-1 rounded-xl">
							<TabsTrigger value="description" className="rounded-lg px-6">Description</TabsTrigger>
							{product.features?.length > 0 && (
								<TabsTrigger value="features" className="rounded-lg px-6">Features</TabsTrigger>
							)}
							{product.requirements?.length > 0 && (
								<TabsTrigger value="requirements" className="rounded-lg px-6">Requirements</TabsTrigger>
							)}
							{(product.faqs?.length || 0) > 0 && (
								<TabsTrigger value="faqs" className="rounded-lg px-6">FAQs</TabsTrigger>
							)}
						</TabsList>
						
						<TabsContent value="description" className="mt-6">
							<Card className="bg-white border-slate-200 p-0">
								<CardContent className="p-8">
									<div className="prose prose-slate max-w-none">
										<p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
											{product.description}
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						
						{product.features?.length > 0 && (
							<TabsContent value="features" className="mt-6">
								<Card className="bg-white border-slate-200">
									<CardContent className="p-8">
										<ul className="grid md:grid-cols-2 gap-4">
											{product.features.map((feature, idx) => (
												<li key={idx} className="flex items-start gap-3">
													<CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
													<span className="text-slate-600">{feature}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</TabsContent>
						)}
						
						{product.requirements?.length > 0 && (
							<TabsContent value="requirements" className="mt-6">
								<Card className="bg-white border-slate-200">
									<CardContent className="p-8">
										<ul className="space-y-3">
											{product.requirements.map((req, idx) => (
												<li key={idx} className="flex items-start gap-3">
													<AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
													<span className="text-slate-600">{req}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</TabsContent>
						)}
						
						{(product.faqs?.length || 0) > 0 && (
							<TabsContent value="faqs" className="mt-6">
								<div className="space-y-4">
									{product.faqs!.map((faq, idx) => (
										<Card key={idx} className="bg-white border-slate-200">
											<CardContent className="p-6">
												<h4 className="font-semibold text-slate-900 mb-2">{faq.question}</h4>
												<p className="text-slate-600">{faq.answer}</p>
											</CardContent>
										</Card>
									))}
								</div>
							</TabsContent>
						)}
					</Tabs>
				</div>
			</div>

			{/* Payment Processing Dialog */}
			<Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{paymentStatus === "success" ? "Payment Successful!" : 
							 paymentStatus === "failed" ? "Payment Failed" : 
							 "Processing Payment..."}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{paymentStatus === "processing" && (
							<div className="text-center py-8">
								<Loader2 className="animate-spin mx-auto mb-4 text-orange-500" size={48} />
								<p className="text-slate-600">Please complete the payment in the Razorpay window...</p>
							</div>
						)}
						
						{paymentStatus === "success" && (
							<div className="text-center py-8">
								<div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
									<CheckCircle size={32} className="text-emerald-600" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Successful!</h3>
								<p className="text-slate-600">Your order has been placed successfully.</p>
							</div>
						)}
						
						{paymentStatus === "failed" && (
							<div className="text-center py-8">
								<div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
									<XCircle size={32} className="text-rose-600" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Failed</h3>
								<p className="text-slate-600">Something went wrong. Please try again.</p>
							</div>
						)}
						
						{paymentStatus !== "processing" && (
							<Button
								onClick={() => setShowPaymentDialog(false)}
								className="w-full bg-gradient-to-r from-orange-500 to-rose-500"
							>
								Close
							</Button>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
