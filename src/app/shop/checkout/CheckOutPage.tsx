"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	ShoppingCart,
	ArrowLeft,
	Tag,
	Percent,
	CreditCard,
	CheckCircle,
	Loader2,
	Shield,
	Zap,
	Download,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { useCart } from "@/context/CartContext";

interface Product {
	_id: string;
	title: string;
	price: number;
	comparePrice?: number;
	currency: string;
	thumbnail?: string;
	category: string;
}

interface CouponData {
	code: string;
	discountType: string;
	discountValue: number;
	discountAmount: number;
	finalAmount: number;
	minimumAmount: number;
	maximumDiscount: number | null;
}

export default function CheckoutComponent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user } = userContext();
	const { cart, clearCart } = useCart();

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [couponCode, setCouponCode] = useState("");
	const [couponData, setCouponData] = useState<CouponData | null>(null);
	const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		"payu" | "binance" | ""
	>("");
	const [transactionId, setTransactionId] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [showTransactionDialog, setShowTransactionDialog] = useState(false);

	const [paymentDetails] = useState({
		binanceWallet: "TEiKjQHn5sRpW69prMSsV2s38PQtndofhb",
		binanceQrUrl: "/usdtscanner.jpeg",
	});

	// Get product ID from URL params (for Direct Buy)
	const singleProductId = searchParams.get("product");

	useEffect(() => {
		if (singleProductId) {
			fetchSingleProduct(singleProductId);
		} else if (cart.length > 0) {
			setProducts(cart);
			setLoading(false);
		} else {
			toast.error("No items in cart");
			router.push("/shop");
		}
	}, [singleProductId, cart, router]);

	const fetchSingleProduct = async (id: string) => {
		try {
			setLoading(true);
			const response = await axios.get(`/api/products/${id}`);
			if (response.data.success) {
				setProducts([response.data.product]);
			} else {
				toast.error("Product not found");
				router.push("/shop");
			}
		} catch (error) {
			console.error("Error fetching product:", error);
			toast.error("Failed to load product");
			router.push("/shop");
		} finally {
			setLoading(false);
		}
	};

	const cartTotal = products.reduce((acc, p) => acc + p.price, 0);
	const currency = products[0]?.currency || "USD";

	const verifyCoupon = async () => {
		if (!couponCode.trim()) {
			toast.error("Please enter a coupon code");
			return;
		}

		if (products.length === 0) return;

		try {
			setIsVerifyingCoupon(true);

			const response = await axios.post("/api/coupons/validate", {
				code: couponCode,
				cartTotal: cartTotal,
				// For simplicity, we use the first product's category/id if it's a single item, 
				// or just use total for cart-wide coupons
				productCategory: products.length === 1 ? products[0].category : null,
				productId: products.length === 1 ? products[0]._id : null,
			});

			if (response.data.success) {
				setCouponData(response.data.coupon);
				toast.success("Coupon applied successfully!");
			} else {
				toast.error(response.data.message);
				setCouponData(null);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Invalid coupon code");
			setCouponData(null);
		} finally {
			setIsVerifyingCoupon(false);
		}
	};

	const removeCoupon = () => {
		setCouponCode("");
		setCouponData(null);
		toast.success("Coupon removed");
	};

	const handleBuy = async () => {
		if (!user) {
			toast.error("Please login to purchase");
			router.push("/login");
			return;
		}

		if (products.length === 0) return;

		if (!selectedPaymentMethod) {
			toast.error("Please select a payment method");
			return;
		}

		if (selectedPaymentMethod === "binance") {
			setShowTransactionDialog(true);
		} else if (selectedPaymentMethod === "payu") {
			initiatePayU();
		}
	};

	const initiatePayU = async () => {
		try {
			setIsProcessing(true);
			
			const orderAmount = couponData ? couponData.finalAmount * 92 : cartTotal * 92;
			const productInfo = products.map(p => p.title).join(", ");
			
			const userFirstName = user?.name || "Customer";
			const userEmail = user?.email || "customer@example.com";
			const userPhone = user?.phone || "9999999999";
			
			const payload = {
				amount: orderAmount.toFixed(2),
				productinfo: productInfo.substring(0, 100), // PayU limit
				firstname: userFirstName,
				email: userEmail,
				phone: userPhone,
				userId: user?._id,
				items: products.map(p => ({
					productId: p._id,
					title: p.title,
					price: p.price,
					thumbnail: p.thumbnail,
					category: p.category
				})),
				couponCode: couponData?.code || null,
				finalAmount: orderAmount,
			};

			const response = await axios.post("/api/payu/initiate", payload);

			if (response.data.success) {
				const { hash, txnid, key } = response.data;
				
				const form = document.createElement("form");
				form.action = "https://secure.payu.in/_payment"; 
				form.method = "POST";
				
				const createInput = (name: string, value: string) => {
					const input = document.createElement("input");
					input.type = "hidden";
					input.name = name;
					input.value = value;
					return input;
				};

				form.appendChild(createInput("key", key));
				form.appendChild(createInput("txnid", txnid));
				form.appendChild(createInput("amount", payload.amount));
				form.appendChild(createInput("productinfo", payload.productinfo));
				form.appendChild(createInput("firstname", payload.firstname));
				form.appendChild(createInput("email", payload.email));
				form.appendChild(createInput("phone", payload.phone));
				
				const baseUrl = window.location.origin;
				form.appendChild(createInput("surl", `${baseUrl}/api/payu/callback`));
				form.appendChild(createInput("furl", `${baseUrl}/api/payu/callback`));
				form.appendChild(createInput("hash", hash));
				
				form.appendChild(createInput("udf1", payload.userId || ""));
				form.appendChild(createInput("udf2", "cart_purchase"));
				form.appendChild(createInput("udf3", JSON.stringify({
					couponCode: payload.couponCode,
					finalAmount: payload.finalAmount,
					currency: "INR",
					itemCount: products.length
				})));

				document.body.appendChild(form);
				form.submit();
			} else {
				toast.error(response.data.message || "Failed to initiate payment");
				setIsProcessing(false);
			}
		} catch (error: any) {
			console.error("PayU initiation error:", error);
			toast.error(error.response?.data?.message || "Failed to connect to payment gateway");
			setIsProcessing(false);
		}
	};

	const submitTransactionId = async () => {
		if (!user) {
			toast.error("Please login to complete payment");
			router.push("/login");
			return;
		}

		if (!transactionId.trim()) {
			toast.error("Transaction ID is required");
			return;
		}

		try {
			setIsVerifying(true);

			const amount = cartTotal;
			const finalAmount = couponData ? couponData.finalAmount : cartTotal;

			const response = await axios.post("/api/orders", {
				items: products.map(p => ({
					productId: p._id,
					title: p.title,
					price: p.price,
					thumbnail: p.thumbnail,
					category: p.category,
					currency: p.currency
				})),
				amount,
				finalAmount,
				currency,
				paymentMethod: selectedPaymentMethod,
				status: "processing",
				couponCode: couponData?.code || null,
				discountAmount: couponData?.discountAmount || 0,
				transactionId: transactionId,
			});

			if (response.data.success) {
				toast.success("Payment submitted successfully!");
				setShowTransactionDialog(false);
				setTransactionId("");
				clearCart();
				setTimeout(() => {
					router.push("/dashboard/orders");
				}, 2000);
			} else {
				toast.error(response.data.message || "Failed to submit payment");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to submit payment");
		} finally {
			setIsVerifying(false);
		}
	};

	const finalTotal = couponData ? couponData.finalAmount : cartTotal;
	const totalDiscount = couponData ? couponData.discountAmount : 0;

	if (loading) {
		return (
			<div className='min-h-screen bg-slate-50 flex items-center justify-center'>
				<Loader2 className='animate-spin text-sky-500' size={48} />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-slate-50'>
			<div className='border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40'>
				<div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
					<Link href='/shop/cart' className='flex items-center text-slate-600 hover:text-sky-600 transition-colors'>
						<ArrowLeft size={20} className='mr-2' />
						<span>Back to Cart</span>
					</Link>
					<h1 className='text-lg font-bold text-slate-900'>Secure Checkout</h1>
					<div className='flex items-center gap-2 text-xs text-slate-500'>
						<Shield size={14} className='text-emerald-500' />
						<span>Bank-grade Encryption</span>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 py-8'>
				<div className='grid lg:grid-cols-3 gap-8'>
					<div className='lg:col-span-2 space-y-6'>
						<Card className='border-slate-200 shadow-sm'>
							<CardHeader className='border-b border-slate-100 bg-slate-50/50'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<ShoppingCart size={20} className='text-sky-600' />
									Order Summary ({products.length} Items)
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 divide-y divide-slate-100'>
								{products.map((p) => (
									<div key={p._id} className='flex gap-4 py-4 first:pt-0 last:pb-0'>
										<div className='w-20 h-20 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200'>
											{p.thumbnail ? (
												<img src={p.thumbnail} alt={p.title} className='w-full h-full object-cover' />
											) : (
												<div className='w-full h-full flex items-center justify-center'><ShoppingCart size={24} className='text-slate-300'/></div>
											)}
										</div>
										<div className='flex-1'>
											<h3 className='font-semibold text-slate-900'>{p.title}</h3>
											<p className='text-sm text-slate-500 capitalize'>{p.category}</p>
											<p className='text-lg font-bold text-slate-900 mt-1'>{p.currency} {p.price.toFixed(2)}</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>

						<Card className='border-slate-200 shadow-sm'>
							<CardHeader className='pb-4'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<Tag size={20} className='text-emerald-500' />
									Apply Coupon Code
								</CardTitle>
							</CardHeader>
							<CardContent>
								{couponData ? (
									<div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600'><CheckCircle size={20} /></div>
											<div>
												<p className='font-bold text-emerald-800'>Coupon Applied: {couponData.code}</p>
												<p className='text-sm text-emerald-600'>You saved {currency} {couponData.discountAmount.toFixed(2)}</p>
											</div>
										</div>
										<Button variant='ghost' size='sm' onClick={removeCoupon} className='text-emerald-700 hover:bg-emerald-100'>Remove</Button>
									</div>
								) : (
									<div className='flex gap-2'>
										<Input
											value={couponCode}
											onChange={(e) => setCouponCode(e.target.value)}
											placeholder='Enter discount code'
											className='h-12'
											onKeyPress={(e) => e.key === "Enter" && verifyCoupon()}
										/>
										<Button onClick={verifyCoupon} disabled={isVerifyingCoupon || !couponCode.trim()} className='h-12 px-6 bg-slate-900 hover:bg-slate-800'>
											{isVerifyingCoupon ? <Loader2 className='animate-spin' size={18} /> : "Apply Code"}
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					<div className='space-y-6'>
						<Card className='border-slate-200 shadow-md sticky top-24'>
							<CardHeader className='border-b border-slate-100 bg-slate-50/50'>
								<CardTitle className='text-lg'>Payment Method</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-6'>
								<div className='space-y-3'>
									<button
										onClick={() => setSelectedPaymentMethod("payu")}
										className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedPaymentMethod === "payu" ? "border-sky-500 bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}
									>
										<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === "payu" ? "border-sky-500 bg-sky-500" : "border-slate-300"}`}>
											{selectedPaymentMethod === "payu" && <div className='w-2 h-2 rounded-full bg-white' />}
										</div>
										<div className='text-left'>
											<p className='font-bold text-slate-900'>PayU India</p>
											<p className='text-xs text-slate-500'>UPI, Cards, NetBanking</p>
										</div>
										<CreditCard className='ml-auto text-slate-400' size={24} />
									</button>

									<button
										onClick={() => setSelectedPaymentMethod("binance")}
										className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedPaymentMethod === "binance" ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}
									>
										<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === "binance" ? "border-orange-500 bg-orange-500" : "border-slate-300"}`}>
											{selectedPaymentMethod === "binance" && <div className='w-2 h-2 rounded-full bg-white' />}
										</div>
										<div className='text-left'>
											<p className='font-bold text-slate-900'>Binance (USDT)</p>
											<p className='text-xs text-slate-500'>Instant Crypto Payment</p>
										</div>
										<Zap className='ml-auto text-orange-500' size={24} />
									</button>
								</div>

								<div className='space-y-3 pt-6 border-t border-slate-100'>
									<div className='flex justify-between text-slate-600'>
										<span>Subtotal</span>
										<span>{currency} {cartTotal.toFixed(2)}</span>
									</div>
									{totalDiscount > 0 && (
										<div className='flex justify-between text-emerald-600'>
											<span>Discount</span>
											<span>- {currency} {totalDiscount.toFixed(2)}</span>
										</div>
									)}
									<div className='flex justify-between text-xl font-bold text-slate-900 pt-2'>
										<span>Total</span>
										<span>{currency} {finalTotal.toFixed(2)}</span>
									</div>
									{selectedPaymentMethod === "payu" && (
										<p className='text-xs text-right text-slate-400'>Approx. ₹{(finalTotal * 92).toFixed(2)}</p>
									)}
								</div>

								<Button
									onClick={handleBuy}
									disabled={isProcessing || !selectedPaymentMethod}
									className='w-full py-7 rounded-2xl text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl group'
								>
									{isProcessing ? <Loader2 className='animate-spin mr-2' /> : <Shield className='mr-2' size={20} />}
									{selectedPaymentMethod ? `Pay with ${selectedPaymentMethod === "payu" ? "PayU" : "Binance"}` : "Select Payment Method"}
								</Button>

								<div className='flex items-center justify-center gap-4 pt-4 text-[10px] text-slate-400 uppercase tracking-widest'>
									<span>PCI Compliant</span>
									<div className='w-1 h-1 bg-slate-300 rounded-full' />
									<span>SSL Secure</span>
									<div className='w-1 h-1 bg-slate-300 rounded-full' />
									<span>Instant Access</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Complete Your Payment</DialogTitle>
						<p className='text-sm text-slate-600'>Send <strong>{currency} {finalTotal.toFixed(2)}</strong> to the address below</p>
					</DialogHeader>
					<div className='space-y-6 py-4'>
						<div className='bg-slate-50 rounded-xl p-4 space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-xs text-slate-500'>USDT (BEP-20) Address</p>
									<p className='font-mono text-sm break-all font-bold'>{paymentDetails.binanceWallet}</p>
								</div>
								<Button variant='ghost' size='sm' onClick={() => {
									navigator.clipboard.writeText(paymentDetails.binanceWallet);
									toast.success("Address copied");
								}}>Copy</Button>
							</div>
							<div className='flex flex-col items-center gap-4'>
								<div className='bg-white p-3 rounded-lg border border-slate-200'>
									<img src={paymentDetails.binanceQrUrl} alt='QR' className='w-48 h-48' />
								</div>
								<p className='text-sm text-center text-slate-500 italic'>Scan the QR code or copy the address above to pay via Binance.</p>
							</div>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-bold text-slate-700'>Transaction Hash/ID <span className='text-rose-500'>*</span></label>
							<Input 
								value={transactionId} 
								onChange={(e) => setTransactionId(e.target.value)}
								placeholder='Paste your transaction ID here'
								className='h-12'
							/>
							<p className='text-[10px] text-slate-400 italic'>Required for verification by admin</p>
						</div>

						<div className='flex gap-3'>
							<Button variant='outline' className='flex-1 py-6' onClick={() => setShowTransactionDialog(false)}>Cancel</Button>
							<Button onClick={submitTransactionId} disabled={isVerifying || !transactionId.trim()} className='flex-1 py-6 bg-slate-900 hover:bg-slate-800 text-white'>
								{isVerifying ? <Loader2 className='animate-spin' /> : "Complete Payment"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
