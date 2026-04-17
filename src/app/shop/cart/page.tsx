"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	ShoppingCart,
	Trash2,
	ArrowLeft,
	ArrowRight,
	ShoppingBag,
	ShieldCheck,
	Zap,
	Download,
	CreditCard,
} from "lucide-react";
import Image from "next/image";

export default function CartPage() {
	const { cart, removeFromCart, getCartTotal, itemCount } = useCart();

	const subtotal = getCartTotal();

	if (itemCount === 0) {
		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center px-4'>
				<div className='w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6'>
					<ShoppingCart size={40} className='text-slate-300' />
				</div>
				<h1 className='text-2xl font-bold text-slate-900 mb-2'>Your cart is empty</h1>
				<p className='text-slate-500 mb-8 max-w-md text-center'>
					Looks like you haven't added anything to your cart yet. Explore our shop to find the best digital assets.
				</p>
				<Link href='/shop'>
					<Button className='bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-8 py-6 rounded-xl shadow-lg shadow-sky-500/20'>
						<ArrowLeft className='mr-2' size={18} />
						Browse Shop
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-slate-50/50 py-12'>
			<div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
				<div className='flex items-center gap-3 mb-8'>
					<div className='p-3 bg-white rounded-xl shadow-sm border border-slate-200'>
						<ShoppingBag size={24} className='text-sky-600' />
					</div>
					<div>
						<h1 className='text-2xl md:text-3xl font-bold text-slate-900'>Shopping Cart</h1>
						<p className='text-slate-500'>{itemCount} items in your cart</p>
					</div>
				</div>

				<div className='grid lg:grid-cols-3 gap-8'>
					{/* Cart Items List */}
					<div className='lg:col-span-2 space-y-4'>
						{cart.map((item) => (
							<Card key={item._id} className='overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group'>
								<CardContent className='p-0'>
									<div className='flex items-center gap-4 sm:gap-6 p-4 sm:p-6'>
										<div className='relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200'>
											{item.thumbnail ? (
												<Image
													src={item.thumbnail}
													alt={item.title}
													fill
													className='object-cover group-hover:scale-110 transition-transform duration-500'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center'>
													<ShoppingBag size={24} className='text-slate-300' />
												</div>
											)}
										</div>

										<div className='flex-1 min-w-0'>
											<div className='flex flex-col sm:flex-row sm:items-start justify-between gap-2'>
												<div>
													<p className='text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1'>
														{item.category}
													</p>
													<Link href={`/shop/${item.slug}`}>
														<h3 className='text-lg font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1'>
															{item.title}
														</h3>
													</Link>
												</div>
												<div className='flex items-center gap-3 self-end sm:self-auto'>
													<span className='text-xl font-bold text-slate-900'>
														{item.currency} {item.price.toFixed(2)}
													</span>
													<button
														onClick={() => removeFromCart(item._id)}
														className='p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200'
														title='Remove item'>
														<Trash2 size={20} />
													</button>
												</div>
											</div>
											<div className='flex flex-wrap gap-2 mt-3'>
												<span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100'>
													<ShieldCheck size={12} /> Secure License
												</span>
												<span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100'>
													<Zap size={12} /> Instant Delivery
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}

						<Link href='/shop' className='inline-flex items-center text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors mt-4 group'>
							<ArrowLeft size={16} className='mr-2 group-hover:-translate-x-1 transition-transform' />
							Continue Shopping
						</Link>
					</div>

					{/* Order Summary */}
					<div className='space-y-6'>
						<Card className='border-slate-200 shadow-sm sticky top-24'>
							<CardContent className='p-6'>
								<h2 className='text-xl font-bold text-slate-900 mb-6'>Order Summary</h2>
								
								<div className='space-y-4'>
									<div className='flex justify-between text-slate-600'>
										<span>Subtotal ({itemCount} items)</span>
										<span className='font-medium text-slate-900'>USD {subtotal.toFixed(2)}</span>
									</div>
									<div className='flex justify-between text-slate-600'>
										<span>Taxes</span>
										<span className='text-slate-400'>Calculated at checkout</span>
									</div>
									
									<div className='pt-4 border-t border-slate-200'>
										<div className='flex justify-between items-end'>
											<div>
												<p className='text-sm text-slate-500 mb-1'>Estimated Total</p>
												<p className='text-3xl font-bold text-slate-900'>USD {subtotal.toFixed(2)}</p>
											</div>
										</div>
									</div>

									<Link href='/shop/checkout' className='block mt-6'>
										<Button className='w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white py-8 rounded-2xl text-lg font-bold shadow-lg shadow-sky-500/20 group'>
											Proceed to Checkout
											<ArrowRight size={20} className='ml-2 group-hover:translate-x-1 transition-transform' />
										</Button>
									</Link>

									<div className='mt-8 pt-8 space-y-4 border-t border-slate-200'>
										<div className='flex items-center gap-3 text-sm text-slate-600'>
											<div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0'>
												<ShieldCheck size={18} />
											</div>
											<p>Secure checkout powered by industry standard encryption</p>
										</div>
										<div className='flex items-center gap-3 text-sm text-slate-600'>
											<div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0'>
												<Download size={18} />
											</div>
											<p>Instant access to digital downloads after successful payment</p>
										</div>
										<div className='flex items-center gap-3 text-sm text-slate-600'>
											<div className='w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0'>
												<CreditCard size={18} />
											</div>
											<p>Multiple payment methods including Crypto & Local Gateways</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
