"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
	CreditCard,
	CheckCircle,
	Loader2,
	Shield,
	Zap,
	Lock,
	ChevronRight,
	ExternalLink,
	Copy,
	Wallet,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { userContext } from "@/context/userContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

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

const INR_CONVERSION_RATE = 92;

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
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"payu" | "binance" | "">("");
	const [transactionId, setTransactionId] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [showTransactionDialog, setShowTransactionDialog] = useState(false);

	const paymentDetails = {
		binanceWallet: "TEiKjQHn5sRpW69prMSsV2s38PQtndofhb",
		binanceQrUrl: "/usdtscanner.jpeg",
	};

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
				router.push("/shop");
			}
		} catch (error) {
			router.push("/shop");
		} finally {
			setLoading(false);
		}
	};

	const cartTotal = useMemo(() => products.reduce((acc, p) => acc + p.price, 0), [products]);
	const currency = products[0]?.currency || "USD";
	const finalTotal = couponData ? couponData.finalAmount : cartTotal;

	const convertedInr = useMemo(() => {
		return (finalTotal * INR_CONVERSION_RATE).toLocaleString("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		});
	}, [finalTotal]);

	const verifyCoupon = async () => {
		if (!couponCode.trim()) return;
		try {
			setIsVerifyingCoupon(true);
			const response = await axios.post("/api/coupons/validate", {
				code: couponCode,
				cartTotal: cartTotal,
				productCategory: products.length === 1 ? products[0].category : null,
				productId: products.length === 1 ? products[0]._id : null,
			});

			if (response.data.success) {
				setCouponData(response.data.coupon);
				toast.success("Coupon applied!");
			} else {
				toast.error(response.data.message);
				setCouponData(null);
			}
		} catch (error: any) {
			toast.error("Invalid coupon code");
			setCouponData(null);
		} finally {
			setIsVerifyingCoupon(false);
		}
	};

	const removeCoupon = () => {
		setCouponCode("");
		setCouponData(null);
	};

	const handleBuy = async () => {
		if (!user) {
			toast.error("Login to continue");
			router.push("/login?redirect=/shop/checkout");
			return;
		}
		if (!selectedPaymentMethod) {
			toast.info("Please select a payment method");
			return;
		}
		if (selectedPaymentMethod === "binance") setShowTransactionDialog(true);
		else if (selectedPaymentMethod === "payu") initiatePayU();
	};

	const initiatePayU = async () => {
		try {
			setIsProcessing(true);
			const payload = {
				amount: (finalTotal * INR_CONVERSION_RATE).toFixed(2),
				productinfo: products.map(p => p.title).join(", ").substring(0, 100),
				firstname: user?.name || "Customer",
				email: user?.email || "",
				phone: user?.phone || "9999999999",
				userId: user?._id,
				items: products.map(p => ({ productId: p._id, quantity: 1 })),
				couponCode: couponData?.code || null,
				finalAmount: finalTotal,
				discountApplied: couponData?.discountAmount || 0,
			};

			const response = await axios.post("/api/payu/initiate", payload);
			if (response.data.success) {
				const { hash, txnid, key } = response.data;
				const form = document.createElement("form");
				form.action = "https://secure.payu.in/_payment";
				form.method = "POST";
				
				const addInput = (name: string, val: string) => {
					const input = document.createElement("input");
					input.type = "hidden"; input.name = name; input.value = val;
					form.appendChild(input);
				};

				addInput("key", key);
				addInput("txnid", txnid);
				addInput("amount", payload.amount);
				addInput("productinfo", payload.productinfo);
				addInput("firstname", payload.firstname);
				addInput("email", payload.email);
				addInput("phone", payload.phone);
				addInput("surl", `${window.location.origin}/api/payu/callback`);
				addInput("furl", `${window.location.origin}/api/payu/callback`);
				addInput("hash", hash);
				addInput("udf1", user?._id || "");
				addInput("udf2", "cart_purchase");
				addInput("udf3", JSON.stringify({ couponCode: payload.couponCode, finalAmount: payload.finalAmount }));

				document.body.appendChild(form);
				form.submit();
			}
		} catch (error) {
			toast.error("Gateway connection failed");
			setIsProcessing(false);
		}
	};

	const submitTransactionId = async () => {
		if (!transactionId.trim()) return;
		try {
			setIsVerifying(true);
			const response = await axios.post("/api/orders", {
				items: products.map(p => ({ productId: p._id, quantity: 1 })),
				amount: cartTotal,
				finalAmount: finalTotal,
				currency,
				paymentMethod: "binance",
				transactionId,
				couponCode: couponData?.code || null,
				discountApplied: couponData?.discountAmount || 0,
			});

			if (response.data.success) {
				toast.success("Order Placed Successfully!");
				clearCart();
				router.push("/dashboard/orders");
			}
		} catch (error) {
			toast.error("Submission failed. Please check TxID.");
		} finally {
			setIsVerifying(false);
		}
	};

	if (loading) return (
		<div className='min-h-screen bg-white flex flex-col items-center justify-center gap-6'>
			<div className="relative">
				<Loader2 className='animate-spin text-slate-900 absolute inset-0 m-auto' size={48} />
				<div className="w-16 h-16 rounded-full border-4 border-slate-100" />
			</div>
			<div className="text-center">
				<p className="text-xl font-black text-slate-900 tracking-tight">SECURE CHECKOUT</p>
				<p className="text-slate-400 text-sm font-medium animate-pulse mt-1">Authenticating your session...</p>
			</div>
		</div>
	);

	return (
		<div className='min-h-screen bg-[#F8FAFC] pb-20 sm:pb-32'>
			{/* Mobile Header */}
			<div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-4 sm:hidden">
				<div className="flex items-center justify-between">
					<Link href='/shop/cart' className='p-2 -ml-2 text-slate-400 hover:text-slate-900'>
						<ArrowLeft size={20} />
					</Link>
					<div className="flex items-center gap-1.5 font-black text-xs tracking-widest text-slate-900">
						<Lock size={12} className="text-emerald-500" />
						CHECKOUT
					</div>
					<div className="w-10" /> {/* Spacer */}
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-16'>
				{/* Desktop Breadcrumbs */}
				<div className="hidden sm:flex items-center justify-between mb-16">
					<Link href='/shop/cart' className='group flex items-center text-slate-400 hover:text-slate-900 transition-all font-bold text-xs tracking-widest'>
						<ArrowLeft size={16} className='mr-2 group-hover:-translate-x-1 transition-transform' />
						RETURN TO CART
					</Link>
					<div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-[10px] font-black tracking-[0.2em] text-emerald-600 uppercase">
						<Shield size={12} />
						256-BIT SSL ENCRYPTION ACTIVE
					</div>
				</div>

				<div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
					{/* Left Column: Flow */}
					<div className='flex-1 space-y-12 lg:space-y-20'>
						{/* Steps: Mobile View */}
						<div className="sm:hidden flex items-center justify-center gap-8 mb-4">
							<div className="flex flex-col items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-slate-100">1</div>
								<span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">Payment</span>
							</div>
							<div className="w-12 h-px bg-slate-200" />
							<div className="flex flex-col items-center gap-2 opacity-30">
								<div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">2</div>
								<span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Order</span>
							</div>
						</div>

						{/* Payment Section */}
						<section>
							<div className="hidden sm:flex items-center gap-4 mb-8">
								<div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">1</div>
								<div>
									<h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Select Payment Method</h2>
									<p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Choose your preferred gateway</p>
								</div>
							</div>
							
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<button
									onClick={() => setSelectedPaymentMethod("payu")}
									className={`group relative p-6 sm:p-8 rounded-[2rem] border-2 text-left transition-all duration-300 ${selectedPaymentMethod === "payu" ? "border-slate-900 bg-white ring-8 ring-slate-900/5 shadow-2xl" : "border-slate-100 bg-white hover:border-slate-200"}`}
								>
									<div className="flex justify-between items-start mb-6">
										<div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === "payu" ? "border-slate-900 bg-slate-900 shadow-lg shadow-slate-900/20" : "border-slate-200"}`}>
											{selectedPaymentMethod === "payu" && <div className='w-2 h-2 rounded-full bg-white animate-pulse' />}
										</div>
										<div className={`p-2 rounded-xl transition-colors ${selectedPaymentMethod === "payu" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-300 group-hover:text-slate-400"}`}>
											<CreditCard size={20} />
										</div>
									</div>
									<p className='font-black text-slate-900 text-xl leading-tight tracking-tight'>PayU India</p>
									<p className='text-[10px] sm:text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest'>UPI • Cards • NetBanking</p>
								</button>

								<button
									onClick={() => setSelectedPaymentMethod("binance")}
									className={`group relative p-6 sm:p-8 rounded-[2rem] border-2 text-left transition-all duration-300 ${selectedPaymentMethod === "binance" ? "border-amber-500 bg-white ring-8 ring-amber-500/5 shadow-2xl" : "border-slate-100 bg-white hover:border-slate-200"}`}
								>
									<div className="flex justify-between items-start mb-6">
										<div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === "binance" ? "border-amber-500 bg-amber-500 shadow-lg shadow-amber-500/20" : "border-slate-200"}`}>
											{selectedPaymentMethod === "binance" && <div className='w-2 h-2 rounded-full bg-white animate-pulse' />}
										</div>
										<div className={`p-2 rounded-xl transition-colors ${selectedPaymentMethod === "binance" ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-300 group-hover:text-slate-400"}`}>
											<Zap size={20} />
										</div>
									</div>
									<p className='font-black text-slate-900 text-xl leading-tight tracking-tight'>Binance Pay</p>
									<p className='text-[10px] sm:text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest'>USDT (BEP-20) Payment</p>
								</button>
							</div>
						</section>

						{/* Order Items Section - Hidden on very small screens or collapsed */}
						<section className="hidden sm:block">
							<div className="flex items-center gap-4 mb-8">
								<div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">2</div>
								<div>
									<h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Order Review</h2>
									<p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{products.length} Items being purchased</p>
								</div>
							</div>
							<div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden p-2">
								<div className="space-y-1">
									{products.map((p) => (
										<div key={p._id} className='flex items-center gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-colors group'>
											<div className='relative w-16 h-16 rounded-2xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100'>
												{p.thumbnail ? (
													<Image fill src={p.thumbnail} alt={p.title} className='object-cover group-hover:scale-110 transition-transform duration-500' />
												) : (
													<div className='w-full h-full flex items-center justify-center text-slate-200'><ShoppingCart size={24}/></div>
												)}
											</div>
											<div className='flex-1 min-w-0'>
												<span className="text-[10px] font-black text-sky-500 tracking-widest uppercase">{p.category}</span>
												<h3 className='font-black text-slate-900 truncate text-lg -mt-0.5'>{p.title}</h3>
											</div>
											<div className="text-right">
												<p className='font-black text-slate-900 text-lg'>{p.currency} {p.price.toLocaleString()}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
					</div>

					{/* Right Column: Checkout Summary */}
					<div className='lg:w-[450px]'>
						<div className="sticky top-12 space-y-6">
							<div className='relative bg-slate-900 rounded-[3rem] p-8 sm:p-12 text-white shadow-2xl shadow-slate-900/30 overflow-hidden'>
								{/* Accent Background Decoration */}
								<div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
								
								<div className="flex items-center justify-between mb-12">
									<h2 className='text-xl sm:text-2xl font-black tracking-tight'>Order Summary</h2>
									<div className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white/60">
										{products.length} ITEMS
									</div>
								</div>

								{/* Coupon Input */}
								<div className="mb-12">
									{couponData ? (
										<div className='bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center justify-between group py-4'>
											<div className='flex items-center gap-3'>
												<div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
													<Tag size={18} />
												</div>
												<div>
													<p className='font-black text-white text-sm uppercase tracking-widest'>{couponData.code}</p>
													<p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">SAVED {currency} {couponData.discountAmount}</p>
												</div>
											</div>
											<button onClick={removeCoupon} className='p-2 text-white/40 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest underline underline-offset-4 decoration-2'>REMOVE</button>
										</div>
									) : (
										<div className='flex gap-3'>
											<Input
												value={couponCode}
												onChange={(e) => setCouponCode(e.target.value)}
												placeholder='DISCOUNT CODE'
												className='h-16 rounded-[1.25rem] bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-white/20 font-black text-xs tracking-[0.2em] placeholder:text-white/20 uppercase px-6'
											/>
											<Button onClick={verifyCoupon} disabled={isVerifyingCoupon || !couponCode.trim()} className='h-16 w-16 min-w-[4rem] rounded-[1.25rem] bg-white text-slate-900 hover:bg-slate-100 p-0 shadow-lg shadow-white/5'>
												{isVerifyingCoupon ? <Loader2 className='animate-spin' size={18} /> : <ChevronRight size={28} />}
											</Button>
										</div>
									)}
								</div>

								{/* Pricing Details */}
								<div className='space-y-5'>
									<div className='flex justify-between items-center text-white/40 text-xs font-black uppercase tracking-[0.15em]'>
										<span>Net Amount</span>
										<span className="text-white font-bold">{currency} {cartTotal.toLocaleString()}</span>
									</div>
									{couponData && (
										<div className='flex justify-between items-center text-emerald-400 text-xs font-black uppercase tracking-[0.15em]'>
											<span>Coupon Discount</span>
											<span>-{currency} {couponData.discountAmount.toLocaleString()}</span>
										</div>
									)}
									<div className='flex justify-between items-center text-white/40 text-xs font-black uppercase tracking-[0.15em]'>
										<span>Platform Fee</span>
										<span className="text-emerald-400 font-black">WAIVED</span>
									</div>

									<div className='pt-10 mt-10 border-t border-white/5'>
										<div className="flex flex-col gap-6">
											<div className="flex flex-col">
												<p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Total Payable Amount</p>
												<p className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tighter">
													<span className="text-xl font-medium text-white/30 mr-2">{currency}</span>
													{finalTotal.toLocaleString()}
												</p>
											</div>

											{/* PayU INR Conversion Display */}
											{selectedPaymentMethod === "payu" && (
												<div className="bg-emerald-500 rounded-[2rem] p-6 text-emerald-950 shadow-xl shadow-emerald-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
													<p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 opacity-60">Estimated Local Amount</p>
													<div className="flex items-center justify-between">
														<p className="text-3xl font-black tracking-tighter">{convertedInr}</p>
														<div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">
															<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
															AUTO-CONVERTED
														</div>
													</div>
													<p className="text-[9px] font-bold mt-2 opacity-50 uppercase tracking-widest">* INCLUDES SECURE GATEWAY PROCESSING</p>
												</div>
											)}
										</div>
									</div>

									<div className="pt-10">
										<Button
											onClick={handleBuy}
											disabled={isProcessing || !selectedPaymentMethod}
											className='w-full py-10 rounded-[2rem] text-xl font-black bg-white hover:bg-slate-100 text-slate-900 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/5'
										>
											{isProcessing ? (
												<div className="flex items-center gap-3">
													<Loader2 className='animate-spin' size={24} />
													<span className="uppercase tracking-widest">Processing...</span>
												</div>
											) : (
												<div className="flex items-center gap-3">
													<Shield size={24} />
													<span className="uppercase tracking-widest">{selectedPaymentMethod ? `PAY VIA ${selectedPaymentMethod.toUpperCase()}` : "CONFIRM METHOD"}</span>
												</div>
											)}
										</Button>
									</div>
								</div>

								<div className="flex items-center justify-center gap-6 mt-10 pt-10 border-t border-white/5">
									<Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={44} height={12} className="opacity-20 grayscale brightness-200" />
									<Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={44} height={12} className="opacity-20 grayscale brightness-200" />
									<Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={32} height={12} className="opacity-20 grayscale brightness-200" />
								</div>
							</div>

							{/* Help Section */}
							<div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 flex items-center justify-between shadow-sm">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
										<Shield size={24} />
									</div>
									<div>
										<h4 className="text-sm font-black text-slate-900 uppercase">Need Support?</h4>
										<p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Contact 24/7 Desk</p>
									</div>
								</div>
								<Link href="https://wa.me/919999999999" target="_blank" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
									<ExternalLink size={20} />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Binance Transaction Dialog */}
			<Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
				<DialogContent className='max-w-md rounded-[3rem] p-0 border-0 shadow-2xl overflow-hidden bg-white'>
					<DialogHeader className="p-10 pb-0">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
								<Wallet size={20} />
							</div>
							<p className='text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]'>Crypto Verification</p>
						</div>
						<DialogTitle className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Complete Transfer</DialogTitle>
						<p className="text-slate-400 text-sm font-medium">Send <span className="text-slate-900 font-bold">{currency} {finalTotal}</span> (USDT BEP-20) to clear invoice.</p>
					</DialogHeader>

					<div className='p-10 space-y-10'>
						<div className='bg-slate-50/50 rounded-[2.5rem] p-8 relative'>
							<div className="flex flex-col items-center">
								<div className='bg-white p-5 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mb-8 border border-slate-100'>
									<Image src={paymentDetails.binanceQrUrl} alt='QR' width={180} height={180} className='rounded-2xl opacity-90' />
								</div>
								
								<div className='w-full space-y-3'>
									<p className='text-[10px] font-black text-slate-400 uppercase tracking-widest text-center'>Recipient Wallet Address</p>
									<div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between group transition-all hover:border-slate-300">
										<p className='font-mono text-[11px] break-all text-slate-500 font-black tracking-tight flex-1'>{paymentDetails.binanceWallet}</p>
										<button onClick={() => {
											navigator.clipboard.writeText(paymentDetails.binanceWallet);
											toast.success("Wallet Address Copied!");
										}} className="ml-4 p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-90">
											<Copy size={16} />
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className='space-y-4'>
							<div className="flex items-center justify-between px-2">
								<label className='text-[10px] font-black text-slate-900 uppercase tracking-widest'>Transaction Hash (TxID)</label>
								<span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 animate-pulse">
									<Lock size={10} /> REQUIRED
								</span>
							</div>
							<Input 
								value={transactionId} 
								onChange={(e) => setTransactionId(e.target.value)}
								placeholder='0x7a...'
								className='h-16 rounded-2xl bg-white border-2 border-slate-100 focus-visible:ring-1 focus-visible:ring-slate-200 font-black text-sm tracking-widest placeholder:text-slate-300 uppercase px-6 text-slate-700'
							/>
						</div>

						<Button onClick={submitTransactionId} disabled={isVerifying || !transactionId.trim()} className='w-full py-10 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-xl transition-all shadow-2xl shadow-slate-900/20'>
							{isVerifying ? (
								<div className="flex items-center gap-3">
									<Loader2 className='animate-spin' />
									<span className="uppercase tracking-[0.2em]">VERIFYING...</span>
								</div>
							) : (
								<div className="flex items-center gap-3">
									<CheckCircle size={24} />
									<span className="uppercase tracking-[0.2em]">SUBMIT PAYMENT</span>
								</div>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
