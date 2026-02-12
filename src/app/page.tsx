"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	TrendingUp,
	Shield,
	Zap,
	Users,
	Globe,
	Smartphone,
	ShoppingCart,
	BarChart3,
	ArrowRight,
	Filter,
	X,
	Eye,
	MapPin,
	DollarSign,
	Star,
	MessageCircle,
	Facebook,
	Mail,
	Phone,
	Sparkles,
	ArrowUpRight,
	Activity,
	Target,
	Layers,
	Cpu,
	MousePointer,
} from "lucide-react";
import { EMAIL, PHONE } from "@/lib/constant";

export default function Home() {


	const features = [
		{
			icon: Shield,
			title: "Verified Sellers",
			description:
				"All sellers are verified and their assets are thoroughly checked",
		},
		{
			icon: Zap,
			title: "Fast Transactions",
			description: "Secure payment processing with instant confirmation",
		},
		{
			icon: TrendingUp,
			title: "Detailed Metrics",
			description:
				"Complete performance data and analytics for every asset",
		},
		{
			icon: Users,
			title: "Expert Support",
			description: "24/7 customer support to help with your transactions",
		},
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
			<style jsx global>{`
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}
			`}</style>
			
			{/* Hero Section */}
			<section className='relative overflow-hidden'>
				{/* Animated Background Elements */}
				<div className='absolute inset-0 overflow-hidden pointer-events-none'>
					<div className='absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/40 to-rose-200/40 rounded-full blur-3xl animate-pulse' />
					<div className='absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-sky-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-full blur-3xl' />
					
					{/* Floating dots pattern */}
					<div className='absolute inset-0 opacity-30'>
						{[...Array(20)].map((_, i) => (
							<div suppressHydrationWarning
								key={i}
								className='absolute w-2 h-2 bg-orange-400/40 rounded-full animate-bounce'
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									animationDelay: `${Math.random() * 2}s`,
									animationDuration: `${3 + Math.random() * 2}s`,
								}}
							/>
						))}
					</div>
				</div>

				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
						{/* Left Content */}
						<div className='text-center lg:text-left relative z-10'>
							{/* Badge */}
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 shadow-lg shadow-orange-500/10 mb-6'>
								<span className='text-xs font-bold text-orange-600 uppercase tracking-wider'>#1 Digital Asset Marketplace</span>
							</div>

							{/* Main Heading */}
							<h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]'>
								Buy & Sell
								<br />
								Digital Assets{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 italic font-serif'>
									Smarter
								</span>
							</h1>

							{/* Description */}
							<p className='text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0'>
								Deelzo gives you the tools to discover, evaluate, and acquire 
								high-quality digital properties. From websites to social media accounts.
							</p>

							{/* CTA Buttons */}
							<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10'>
								<Link href='/marketplace'>
									<Button className='bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-6 text-base font-semibold shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 rounded-xl'>
										Get Started
									</Button>
								</Link>
								<Link href='/guide'>
									<Button
										variant='outline'
										className='border-2 border-slate-200 cursor-pointer text-slate-700 hover:bg-white hover:border-orange-300 px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 rounded-xl group'>
										Book a Demo
										<ArrowRight size={18} className='ml-2 group-hover:translate-x-1 transition-transform' />
									</Button>
								</Link>
							</div>

							{/* Social Proof */}
							<div className='flex items-center gap-4 justify-center lg:justify-start'>
								{/* Avatar Stack */}
								<div className='flex -space-x-3'>
									{[0, 1, 2].map((i) => (
										<div
											key={i}
											className='w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center overflow-hidden shadow-md'
										>
											<span className='text-sm font-bold text-orange-600'>{String.fromCharCode(65 + i)}</span>
										</div>
									))}
								</div>
								<div>
									<div className='flex items-center gap-1'>
										<Star size={16} className='text-amber-400 fill-amber-400' />
										<span className='font-bold text-slate-900'>4.9</span>
									</div>
									<p className='text-xs text-slate-500'>(2,500+ reviews)</p>
								</div>
							</div>
						</div>

						{/* Right Content - Hero Visual */}
						<div className='relative lg:h-[600px] flex items-center justify-center'>
							{/* Main Image Container */}
							<div className='relative w-full max-w-lg'>
								{/* Background Card */}
								<div className='absolute inset-0 bg-gradient-to-br from-orange-100/50 to-rose-100/50 rounded-3xl transform rotate-3 scale-105' />
								
								{/* Main Image */}
								<div className='relative bg-white rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden border border-slate-100'>
									<video
										src='/main.mp4'
										height={500}
										width={500}
										autoPlay
										muted
										loop
										className='w-full h-auto object-cover'
									/>
								</div>

								{/* Floating Stats Card - Blog Traffic */}
								<div className='absolute -left-4 md:-left-8 top-1/4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100' style={{ animation: 'float 3s ease-in-out infinite' }}>
									<div className='flex items-center gap-2 mb-2'>
										<Activity size={16} className='text-emerald-500' />
										<span className='text-xs font-medium text-slate-600'>Blog Traffic</span>
										<span className='text-xs font-bold text-emerald-500 flex items-center gap-0.5'>
											<ArrowUpRight size={10} />
											+16.5%
										</span>
									</div>
									<p className='text-2xl font-bold text-slate-900'>125,536</p>
									<p className='text-xs text-slate-400'>Since last week</p>
								</div>

								{/* Floating Stats Card - SEO Analytics */}
								<div className='absolute -right-2 md:-right-4 bottom-1/4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100' style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}>
									<div className='flex items-center gap-2 mb-3'>
										<Target size={16} className='text-orange-500' />
										<span className='text-xs font-medium text-slate-600'>SEO Analytics</span>
										<span className='text-xs font-bold text-emerald-500 flex items-center gap-0.5'>
											<ArrowUpRight size={10} />
											+20%
										</span>
									</div>
									{/* Circular Progress */}
									<div className='relative w-20 h-20 mx-auto'>
										<svg className='w-full h-full transform -rotate-90'>
											<circle
												cx='40'
												cy='40'
												r='32'
												stroke='#f1f5f9'
												strokeWidth='8'
												fill='none'
											/>
											<circle
												cx='40'
												cy='40'
												r='32'
												stroke='url(#gradient)'
												strokeWidth='8'
												fill='none'
												strokeLinecap='round'
												strokeDasharray={`${0.8 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
												className='transition-all duration-1000'
											/>
											<defs>
												<linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
													<stop offset='0%' stopColor='#f97316' />
													<stop offset='100%' stopColor='#f43f5e' />
												</linearGradient>
											</defs>
										</svg>
										<div className='absolute inset-0 flex items-center justify-center'>
											<span className='text-lg font-bold text-slate-900'>80%</span>
										</div>
									</div>
								</div>

								{/* AI Badge */}
								<div className='absolute -right-2 top-8 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg shadow-rose-500/25' style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
									<div className='flex items-center gap-2'>
										<Sparkles size={14} />
										<span className='text-sm font-semibold'>Free Listing</span>
									</div>
								</div>

								{/* Side Icons Panel */}
								<div className='absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3'>
									{[Layers, MousePointer, Cpu, Zap].map((Icon, i) => (
										<div
											key={i}
											className='w-10 h-10 bg-white rounded-xl shadow-lg shadow-slate-200/50 flex items-center justify-center border border-slate-100 hover:scale-110 transition-transform cursor-pointer'
											style={{ animationDelay: `${i * 0.1}s` }}
										>
											<Icon size={18} className='text-slate-400' />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

			</section>

			{/* Combined About, Features & Testimonials Section */}
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100'>
				{/* Top wave transition from Featured Listings */}
				<div className='absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent' />
				
				{/* Unified flowing background decorations */}
				<div className='absolute top-20 right-0 w-[700px] h-[700px] bg-gradient-to-br from-orange-200/25 to-rose-200/25 rounded-full blur-3xl animate-pulse' />
				<div className='absolute top-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-br from-sky-200/25 to-blue-200/25 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '0.5s' }} />
				<div className='absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
				<div className='absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1.5s' }} />
				
				{/* Floating elements throughout entire section */}
				<div className='absolute top-40 left-20 w-20 h-20 bg-gradient-to-br from-orange-400/15 to-rose-400/15 rounded-2xl rotate-12 animate-bounce' style={{ animationDuration: '4s' }} />
				<div className='absolute top-1/3 right-32 w-16 h-16 bg-gradient-to-br from-sky-400/15 to-blue-400/15 rounded-full animate-bounce' style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
				<div className='absolute top-2/3 left-32 w-24 h-24 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-xl -rotate-12 animate-bounce' style={{ animationDuration: '6s', animationDelay: '1s' }} />
				<div className='absolute bottom-40 right-20 w-16 h-16 bg-gradient-to-br from-violet-400/15 to-purple-400/15 rounded-full animate-bounce' style={{ animationDuration: '4.5s', animationDelay: '1.5s' }} />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					
					{/* PART 1: About Content */}
					<div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 md:mb-32'>
						{/* Left Content */}
						<div className='space-y-8'>
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-rose-50 rounded-full border border-orange-200 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300'>
								<Sparkles size={16} className='text-orange-500' />
								<span className='text-sm font-semibold text-orange-700'>About Us</span>
							</div>
							
							<h2 className='text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>
								The Most Trusted
								<span className='block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500'>
									Digital Marketplace
								</span>
							</h2>
							
							<p className='text-lg text-slate-600 leading-relaxed'>
								Deelzo is a premier marketplace for digital assets, founded by 
								<span className='font-semibold text-slate-900'>AdSense Guru (Amit Singh)</span>. 
								With over 4 years of experience in digital marketing and website development, 
								we've created a trusted platform for buying and selling digital properties worldwide.
							</p>
							
							{/* Stats */}
							<div className='grid grid-cols-3 gap-6 py-6 border-y border-slate-200/80'>
								{[
									{ value: "4+", label: "Years Experience", gradient: "from-orange-500 to-rose-500" },
									{ value: "2.5K+", label: "Happy Clients", gradient: "from-sky-500 to-blue-500" },
									{ value: "98%", label: "Success Rate", gradient: "from-emerald-500 to-teal-500" },
								].map((stat, i) => (
									<div key={i} className={`text-center group cursor-pointer ${i === 1 ? 'border-x border-slate-200/80' : ''}`}>
										<p className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>{stat.value}</p>
										<p className='text-sm text-slate-500 mt-1 group-hover:text-slate-700 transition-colors'>{stat.label}</p>
									</div>
								))}
							</div>
							
							{/* Contact Info */}
							<div className='flex flex-wrap gap-6'>
								<div className='flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group'>
									<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform'>
										<Mail size={18} className='text-orange-600' />
									</div>
									<div>
										<p className='text-xs text-slate-500'>Email</p>
										<p className='text-sm font-semibold text-slate-900'>{EMAIL}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group'>
									<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform'>
										<MessageCircle size={18} className='text-sky-600' />
									</div>
									<div>
										<p className='text-xs text-slate-500'>WhatsApp</p>
										<p className='text-sm font-semibold text-slate-900'>{PHONE}</p>
									</div>
								</div>
							</div>
							
							<div className='flex flex-wrap gap-4'>
								<Link href='/about' className='inline-flex'>
									<Button className='bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 rounded-xl group'>
										Learn More
										<ArrowRight size={18} className='ml-2 group-hover:translate-x-1 transition-transform' />
									</Button>
								</Link>
								<Link
									href='https://www.facebook.com/adsenseguruteam'
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex'>
									<Button
										variant='outline'
										className='border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-8 py-6 text-base font-semibold transition-all duration-300 rounded-xl group hover:scale-105'>
										<Facebook size={18} className='mr-2 text-blue-600 group-hover:scale-110 transition-transform' />
										Follow Us
									</Button>
								</Link>
							</div>
						</div>
						
						{/* Right Content - Community Card */}
						<div className='relative'>
							{/* Decorative elements */}
							<div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl opacity-20 rotate-12 animate-pulse' />
							<div className='absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-400 rounded-full opacity-20 animate-pulse' style={{ animationDelay: '0.5s' }} />
							
							<div className='relative bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-10 hover:shadow-orange-500/10 transition-shadow duration-500'>
								<div className='flex items-center gap-3 mb-8'>
									<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/25'>
										<Users size={24} className='text-white' />
									</div>
									<div>
										<h3 className='text-2xl font-bold text-slate-900'>Join Our Community</h3>
										<p className='text-sm text-slate-500'>Connect with 10,000+ members</p>
									</div>
								</div>
								
								<div className='space-y-4'>
									<a
										href='https://chat.whatsapp.com/BDahUf9nbFk7tY3ry27bIZ'
										target='_blank'
										rel='noopener noreferrer'
										className='group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
										<div className='w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform'>
											<MessageCircle size={24} className='text-white' />
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-slate-900'>WhatsApp Group</p>
											<p className='text-sm text-slate-500'>Daily updates & discussions</p>
										</div>
										<ArrowRight size={18} className='text-green-600 group-hover:translate-x-1 transition-transform' />
									</a>
									
									<a
										href='https://www.facebook.com/groups/adsenseguruteam'
										target='_blank'
										rel='noopener noreferrer'
										className='group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
										<div className='w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform'>
											<Facebook size={24} className='text-white' />
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-slate-900'>Facebook Group</p>
											<p className='text-sm text-slate-500'>Community support & tips</p>
										</div>
										<ArrowRight size={18} className='text-blue-600 group-hover:translate-x-1 transition-transform' />
									</a>
									
									<a
										href={`https://wa.me/${PHONE}`}
										target='_blank'
										rel='noopener noreferrer'
										className='group flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100 rounded-xl border border-cyan-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1'>
										<div className='w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform'>
											<Phone size={24} className='text-white' />
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-slate-900'>Direct Support</p>
											<p className='text-sm text-slate-500'>24/7 personal assistance</p>
										</div>
										<ArrowRight size={18} className='text-cyan-600 group-hover:translate-x-1 transition-transform' />
									</a>
								</div>
								
								{/* Trust badges */}
								<div className='mt-8 pt-6 border-t border-slate-100'>
									<p className='text-xs text-slate-400 text-center mb-4'>Trusted by digital entrepreneurs worldwide</p>
									<div className='flex justify-center gap-4'>
										{[Shield, Zap, Star].map((Icon, i) => (
											<div key={i} className='w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 hover:scale-110 transition-all cursor-pointer'>
												<Icon size={18} className='text-slate-400' />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
					
					{/* Visual connector - About to Features */}
					<div className='flex items-center justify-center mb-20 md:mb-24'>
						<div className='flex items-center gap-6'>
							<div className='h-px w-32 bg-gradient-to-r from-transparent via-orange-300 to-orange-300' />
							<div className='w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse'>
								<ArrowRight size={24} className='text-white rotate-90' />
							</div>
							<div className='h-px w-32 bg-gradient-to-l from-transparent via-emerald-300 to-emerald-300' />
						</div>
					</div>
					
					{/* PART 2: Why Choose Us (Features) */}
					<div className='text-center mb-16 md:mb-20'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200 mb-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300'>
							<Sparkles size={16} className='text-emerald-500' />
							<span className='text-sm font-semibold text-emerald-700'>Why Choose Us</span>
						</div>
						<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6'>
							Built for <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500'>Success</span>
						</h2>
						<p className='text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'>
							Experience a platform designed with security, speed, and transparency at its core
						</p>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
						{features.map((feature, index) => {
							const Icon = feature.icon;
							const gradients = [
								"from-emerald-500 to-teal-500",
								"from-orange-500 to-rose-500",
								"from-sky-500 to-blue-500",
								"from-violet-500 to-purple-500",
							];
							const bgGradients = [
								"from-emerald-50 to-teal-50",
								"from-orange-50 to-rose-50",
								"from-sky-50 to-blue-50",
								"from-violet-50 to-purple-50",
							];
							const borderColors = [
								"group-hover:border-emerald-300",
								"group-hover:border-orange-300",
								"group-hover:border-sky-300",
								"group-hover:border-violet-300",
							];
							const shadowColors = [
								"group-hover:shadow-emerald-500/20",
								"group-hover:shadow-orange-500/20",
								"group-hover:shadow-sky-500/20",
								"group-hover:shadow-violet-500/20",
							];
							
							return (
								<div
									key={index}
									className={`group relative bg-white border border-slate-200 ${borderColors[index]} rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl ${shadowColors[index]} hover:-translate-y-3 overflow-hidden`}>
									{/* Top gradient bar */}
									<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[index]} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
									
									{/* Background glow on hover */}
									<div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index]} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
									
									{/* Icon */}
									<div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
										<Icon size={32} className='text-white' />
									</div>
									
									{/* Content */}
									<h3 className='relative text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all duration-300'>
										{feature.title}
									</h3>
									<p className='relative text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300'>
										{feature.description}
									</p>
									
									{/* Arrow indicator */}
									<div className='absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2 group-hover:bg-gradient-to-br group-hover:from-slate-200 group-hover:to-slate-300'>
										<ArrowRight size={18} className='text-slate-600' />
									</div>
									
									{/* Decorative corner */}
									<div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
								</div>
							);
						})}
					</div>
					
					{/* Bottom stats */}
					<div className='mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 mb-20'>
						{[
							{ value: "$10000+", label: "Assets Sold", gradient: "from-emerald-500 to-teal-500" },
							{ value: "10k+", label: "Active Users", gradient: "from-orange-500 to-rose-500" },
							{ value: "99.9%", label: "Uptime", gradient: "from-sky-500 to-blue-500" },
							{ value: "24/7", label: "Support", gradient: "from-violet-500 to-purple-500" },
						].map((stat, i) => (
							<div key={i} className='group text-center p-4 rounded-2xl hover:bg-white/90 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm'>
								<p className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>{stat.value}</p>
								<p className='text-slate-500 text-sm mt-1 group-hover:text-slate-700 transition-colors'>{stat.label}</p>
							</div>
						))}
					</div>
					
					{/* Visual connector - Features to How It Works */}
					<div className='flex items-center justify-center mb-20 md:mb-24'>
						<div className='flex items-center gap-6'>
							<div className='h-px w-32 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-300' />
							<div className='w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-pulse'>
								<ArrowRight size={24} className='text-white rotate-90' />
							</div>
							<div className='h-px w-32 bg-gradient-to-l from-transparent via-sky-300 to-sky-300' />
						</div>
					</div>
					
					{/* PART 3: How It Works */}
					<div className='text-center mb-16 md:mb-20'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full border border-sky-200 mb-6 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300'>
							<Sparkles size={16} className='text-sky-500' />
							<span className='text-sm font-semibold text-sky-700'>Simple Process</span>
						</div>
						<h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-4'>
							How It <span className='text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500'>Works</span>
						</h2>
						<p className='text-slate-600 text-lg max-w-2xl mx-auto'>
							Get started in minutes with our simple 3-step process
						</p>
					</div>
					
					<div className='grid md:grid-cols-3 gap-8 md:gap-12'>
						{[
							{ 
								step: "01", 
								title: "Browse Listings", 
								description: "Explore thousands of verified digital assets across multiple categories. Filter by price, metrics, and location.",
								icon: Globe,
								color: "from-orange-500 to-rose-500",
								bgGradient: "from-orange-50 to-rose-50",
								borderColor: "group-hover:border-orange-300"
							},
							{ 
								step: "02", 
								title: "Connect & Negotiate", 
								description: "Message sellers directly, ask questions, and negotiate terms. Our secure platform protects both parties.",
								icon: MessageCircle,
								color: "from-sky-500 to-blue-500",
								bgGradient: "from-sky-50 to-blue-50",
								borderColor: "group-hover:border-sky-300"
							},
							{ 
								step: "03", 
								title: "Secure Transaction", 
								description: "Complete your purchase with our escrow protection. Transfer assets safely and receive payment securely.",
								icon: Shield,
								color: "from-emerald-500 to-teal-500",
								bgGradient: "from-emerald-50 to-teal-50",
								borderColor: "group-hover:border-emerald-300"
							},
						].map((item, index) => {
							const Icon = item.icon;
							return (
								<div key={index} className='relative group'>
									{/* Connector line with animated gradient */}
									{index < 2 && (
										<div className='hidden md:block absolute top-16 left-full w-full h-1 bg-slate-200 rounded-full overflow-hidden'>
											<div className='absolute inset-0 bg-gradient-to-r from-orange-400 via-sky-400 to-emerald-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000' />
										</div>
									)}
									
									<div className={`relative bg-white rounded-2xl border border-slate-200 ${item.borderColor} p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 overflow-hidden`}>
										{/* Top gradient bar */}
										<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
										
										{/* Background glow on hover */}
										<div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
										
										{/* Step number with pulse animation */}
										<div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
											<span className='text-white font-bold text-lg'>{item.step}</span>
											<div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} animate-ping opacity-20`} />
										</div>
										
										<div className='relative'>
											<div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} opacity-10 flex items-center justify-center mb-4 group-hover:opacity-20 transition-opacity`}>
												<Icon size={28} className={`text-transparent bg-clip-text bg-gradient-to-br ${item.color}`} />
											</div>
											<h3 className='text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all duration-300'>{item.title}</h3>
											<p className='text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors'>{item.description}</p>
										</div>
										
										{/* Arrow indicator */}
										<div className='absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2 group-hover:bg-gradient-to-br group-hover:from-slate-200 group-hover:to-slate-300'>
											<ArrowRight size={18} className='text-slate-600' />
										</div>
										
										{/* Decorative corner */}
										<div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
									</div>
								</div>
							);
						})}
					</div>
					
					{/* Visual connector - How It Works to Testimonials */}
					<div className='flex items-center justify-center mb-20 md:mb-24 mt-20'>
						<div className='flex items-center gap-6'>
							<div className='h-px w-32 bg-gradient-to-r from-transparent via-sky-300 to-sky-300' />
							<div className='w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/25 animate-pulse'>
								<ArrowRight size={24} className='text-white rotate-90' />
							</div>
							<div className='h-px w-32 bg-gradient-to-l from-transparent via-amber-300 to-amber-300' />
						</div>
					</div>
					
					{/* PART 4: Testimonials */}
					<div className='text-center mb-16'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200 mb-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300'>
							<Star size={16} className='text-amber-500 fill-amber-500' />
							<span className='text-sm font-semibold text-amber-700'>Testimonials</span>
						</div>
						<h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-4'>
							Loved by <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500'>Entrepreneurs</span>
						</h2>
						<p className='text-slate-600 text-lg max-w-2xl mx-auto'>
							See what our community has to say about their experience
						</p>
					</div>
					
					<div className='grid md:grid-cols-3 gap-6 md:gap-8'>
						{[
							{
								quote: "Deelzo made selling my website incredibly easy. The verification process gave buyers confidence, and I got a great price!",
								author: "Rajesh Kumar",
								role: "Sold Website for $45K",
								rating: 5,
								gradient: "from-orange-500 to-rose-500",
								bgGradient: "from-orange-50 to-rose-50",
								borderColor: "group-hover:border-orange-300",
								shadowColor: "group-hover:shadow-orange-500/20"
							},
							{
								quote: "I've bought multiple YouTube channels through Deelzo. The detailed metrics and secure transactions are unmatched.",
								author: "Priya Sharma",
								role: "Digital Investor",
								rating: 5,
								gradient: "from-sky-500 to-blue-500",
								bgGradient: "from-sky-50 to-blue-50",
								borderColor: "group-hover:border-sky-300",
								shadowColor: "group-hover:shadow-sky-500/20"
							},
							{
								quote: "The support team is amazing! They guided me through my first purchase and made sure everything went smoothly.",
								author: "Amit Patel",
								role: "First-time Buyer",
								rating: 5,
								gradient: "from-emerald-500 to-teal-500",
								bgGradient: "from-emerald-50 to-teal-50",
								borderColor: "group-hover:border-emerald-300",
								shadowColor: "group-hover:shadow-emerald-500/20"
							},
						].map((testimonial, index) => (
							<div key={index} className={`group relative bg-white border border-slate-200 rounded-2xl p-8 ${testimonial.borderColor} transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${testimonial.shadowColor} overflow-hidden`}>
								{/* Top gradient bar */}
								<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
								
								{/* Background glow on hover */}
								<div className={`absolute inset-0 bg-gradient-to-br ${testimonial.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
								
								{/* Quote icon */}
								<div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
									<span className='text-white text-2xl font-serif'>"</span>
								</div>
								
								{/* Rating */}
								<div className='flex gap-1 mb-4'>
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star key={i} size={16} className='text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform' style={{ transitionDelay: `${i * 50}ms` }} />
									))}
								</div>
								
								<p className='text-slate-600 leading-relaxed mb-6 relative group-hover:text-slate-700 transition-colors'>{testimonial.quote}</p>
								
								<div className='flex items-center gap-3 relative'>
									<div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
										<span className='text-white font-bold'>{testimonial.author.charAt(0)}</span>
									</div>
									<div>
										<p className='text-slate-900 font-semibold'>{testimonial.author}</p>
										<p className='text-slate-500 text-sm'>{testimonial.role}</p>
									</div>
								</div>
								
								{/* Decorative corner */}
								<div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
							</div>
						))}
					</div>
					
					{/* Bottom wave transition to CTA */}
					<div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent' />
				</div>
			</section>

			{/* CTA Section */}
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100'>
				{/* Top border line */}
				<div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent' />
				
				{/* Background decorations */}
				<div className='absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-rose-200/40 rounded-full blur-3xl animate-pulse' />
				<div className='absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-sky-200/40 to-blue-200/40 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
				
				{/* Floating animated shapes */}
				<div className='absolute top-40 right-40 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-rose-400/20 rounded-2xl rotate-12 animate-bounce' style={{ animationDuration: '4s' }} />
				<div className='absolute bottom-40 left-40 w-20 h-20 bg-gradient-to-br from-sky-400/20 to-blue-400/20 rounded-full animate-bounce' style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
				<div className='absolute top-1/2 right-20 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-xl -rotate-12 animate-pulse' style={{ animationDelay: '0.3s' }} />
				
				<div className='relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<div className='text-center lg:text-left'>
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-rose-50 rounded-full border border-orange-200 mb-6 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group cursor-pointer'>
								<Zap size={16} className='text-orange-500 group-hover:scale-110 transition-transform' />
								<span className='text-sm font-semibold text-orange-700'>Start Today</span>
							</div>
							<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight'>
								Ready to Transform
								<span className='block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500'>Your Digital Portfolio?</span>
							</h2>
							<p className='text-slate-600 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0'>
								Join 10,000+ entrepreneurs who trust Deelzo for buying and selling premium digital assets.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
								<Link href='/marketplace'>
									<Button className='bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-6 text-base font-semibold shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 rounded-xl group'>
										Explore Marketplace
										<ArrowRight size={20} className='ml-2 group-hover:translate-x-1 transition-transform' />
									</Button>
								</Link>
								<Link href='/signup'>
									<Button 
										variant='outline' 
										className='border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-orange-300 px-8 py-6 text-base font-semibold transition-all duration-300 rounded-xl hover:scale-105 hover:shadow-lg'>
										Create Free Account
									</Button>
								</Link>
							</div>
						</div>
						
						<div className='hidden lg:block relative'>
							{/* Decorative elements */}
							<div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl opacity-20 rotate-12 animate-pulse' />
							<div className='absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-400 rounded-full opacity-20 animate-pulse' style={{ animationDelay: '0.5s' }} />
							
							<div className='relative bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 hover:shadow-orange-500/10 transition-shadow duration-500'>
								<div className='flex items-center gap-4 mb-6'>
									<div className='flex -space-x-3'>
										{[0, 1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className='w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-orange-200 to-rose-200 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer'
											>
												<span className='text-xs font-bold text-slate-700'>{String.fromCharCode(65 + i)}</span>
											</div>
										))}
									</div>
									<div className='text-slate-900'>
										<p className='font-bold'>10,000+</p>
										<p className='text-sm text-slate-500'>Active Users</p>
									</div>
								</div>
								
								<div className='space-y-4'>
									<div className='flex items-center gap-3 text-slate-700 group/item hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer'>
										<div className='w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover/item:scale-110 transition-transform'>
											<Shield size={16} className='text-emerald-600' />
										</div>
										<span className='text-sm font-medium'>Secure Escrow Protection</span>
										<ArrowRight size={14} className='ml-auto text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all' />
									</div>
									<div className='flex items-center gap-3 text-slate-700 group/item hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer'>
										<div className='w-8 h-8 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center group-hover/item:scale-110 transition-transform'>
											<Zap size={16} className='text-sky-600' />
										</div>
										<span className='text-sm font-medium'>Instant Asset Transfer</span>
										<ArrowRight size={14} className='ml-auto text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all' />
									</div>
									<div className='flex items-center gap-3 text-slate-700 group/item hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer'>
										<div className='w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover/item:scale-110 transition-transform'>
											<Users size={16} className='text-amber-600' />
										</div>
										<span className='text-sm font-medium'>24/7 Expert Support</span>
										<ArrowRight size={14} className='ml-auto text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all' />
									</div>
								</div>
								
								<div className='mt-6 pt-6 border-t border-slate-100'>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-slate-500'>Platform Fee</span>
										<span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500'>Only 5%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
