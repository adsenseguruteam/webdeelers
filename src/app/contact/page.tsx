"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowLeft,
	Mail,
	Phone,
	MessageCircle,
	Clock,
	CheckCircle,
	Send,
	Loader2,
	MapPin,
} from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		// In a real app, this would send to an API
		setTimeout(() => {
			console.log("Form submitted:", formData);
			setSubmitted(true);
			toast.success("Message sent successfully!");
			setFormData({ name: "", email: "", subject: "", message: "" });
			setLoading(false);
			setTimeout(() => {
				setSubmitted(false);
			}, 3000);
		}, 1000);
	};

	const contactInfo = [
		{
			icon: Mail,
			title: "Email",
			value: "evtnorg@gmail.com",
			href: "mailto:evtnorg@gmail.com",
			color: "from-blue-500 to-sky-500",
			bgColor: "from-blue-50 to-sky-50",
			borderColor: "border-blue-200",
			textColor: "text-blue-700",
		},
		{
			icon: MessageCircle,
			title: "WhatsApp",
			value: "+91 7755089819",
			href: "https://wa.me/917755089819",
			color: "from-emerald-500 to-green-500",
			bgColor: "from-emerald-50 to-green-50",
			borderColor: "border-emerald-200",
			textColor: "text-emerald-700",
		},
		{
			icon: Clock,
			title: "Response Time",
			value: "Within 12 hours",
			href: null,
			color: "from-amber-500 to-orange-500",
			bgColor: "from-amber-50 to-orange-50",
			borderColor: "border-amber-200",
			textColor: "text-amber-700",
		},
		{
			icon: MapPin,
			title: "Support Hours",
			value: "Mon - Fri: 9 AM - 6 PM IST",
			href: null,
			color: "from-purple-500 to-pink-500",
			bgColor: "from-purple-50 to-pink-50",
			borderColor: "border-purple-200",
			textColor: "text-purple-700",
		},
	];

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
			{/* Header */}
			<div className='bg-white border-b border-slate-200 shadow-sm'>
				<div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6'>
					<Link href='/'>
						<Button
							variant='ghost'
							className='text-slate-700 hover:text-slate-900 hover:bg-slate-100 gap-2'>
							<ArrowLeft size={18} />
							Back to Home
						</Button>
					</Link>
				</div>
			</div>

			{/* Hero Section */}
			<div className='relative overflow-hidden bg-linear-to-r from-sky-500 via-blue-500 to-cyan-500 py-12 md:py-16'>
				<div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
				<div className='max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10'>
					<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
						Contact Us
					</h1>
					<p className='text-white/90 text-lg md:text-xl max-w-2xl mx-auto'>
						Have questions? We'd love to hear from you. Get in touch and we'll
						respond as soon as possible.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Contact Info Cards */}
					<div className='lg:col-span-1 space-y-4'>
						{contactInfo.map((info, index) => {
							const Icon = info.icon;
							const CardComponent = info.href ? Link : 'div';
							const cardProps = info.href
								? { href: info.href, target: '_blank', rel: 'noopener noreferrer' }
								: {};

							return (
								<Card
									key={index}
									className={`bg-linear-to-br ${info.bgColor} border ${info.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
										info.href ? 'cursor-pointer' : ''
									}`}>
									<CardContent className='p-6'>
										<div className='flex items-start gap-4'>
											<div
												className={`w-12 h-12 rounded-xl bg-linear-to-br ${info.color} flex items-center justify-center shrink-0`}>
												<Icon size={24} className='text-white' />
											</div>
											<div className='flex-1'>
												<h3
													className={`font-bold ${info.textColor} mb-1 text-base`}>
													{info.title}
												</h3>
												{info.href ? (
													<a
														href={info.href}
														className={`${info.textColor} hover:underline text-sm font-medium`}>
														{info.value}
													</a>
												) : (
													<p className={`${info.textColor} text-sm font-medium`}>
														{info.value}
													</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Contact Form */}
					<div className='lg:col-span-2'>
						<Card className='bg-white border border-slate-200 shadow-xl'>
							<CardHeader className='border-b border-slate-200'>
								<CardTitle className='text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2'>
									<MessageCircle size={28} className='text-sky-600' />
									Send us a Message
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 md:p-8'>
								{submitted ? (
									<div className='text-center py-12 space-y-4'>
										<div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto'>
											<CheckCircle size={32} className='text-emerald-600' />
										</div>
										<h3 className='text-xl font-bold text-slate-900'>
											Message Sent!
										</h3>
										<p className='text-slate-600'>
											Thank you for contacting us. We'll get back to you soon.
										</p>
									</div>
								) : (
									<form onSubmit={handleSubmit} className='space-y-5'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
											<div>
												<Label
													htmlFor='name'
													className='text-slate-700 font-semibold text-sm mb-2 block'>
													Full Name
												</Label>
												<Input
													id='name'
													name='name'
													type='text'
													placeholder='John Doe'
													value={formData.name}
													onChange={handleChange}
													required
													className='h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
												/>
											</div>
											<div>
												<Label
													htmlFor='email'
													className='text-slate-700 font-semibold text-sm mb-2 block'>
													Email Address
												</Label>
												<Input
													id='email'
													name='email'
													type='email'
													placeholder='you@example.com'
													value={formData.email}
													onChange={handleChange}
													required
													className='h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
												/>
											</div>
										</div>

										<div>
											<Label
												htmlFor='subject'
												className='text-slate-700 font-semibold text-sm mb-2 block'>
												Subject
											</Label>
											<Input
												id='subject'
												name='subject'
												type='text'
												placeholder='What is this regarding?'
												value={formData.subject}
												onChange={handleChange}
												required
												className='h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
											/>
										</div>

										<div>
											<Label
												htmlFor='message'
												className='text-slate-700 font-semibold text-sm mb-2 block'>
												Message
											</Label>
											<textarea
												id='message'
												name='message'
												rows={6}
												placeholder='Tell us how we can help...'
												value={formData.message}
												onChange={handleChange}
												required
												className='w-full p-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20 resize-none'
											/>
										</div>

										<Button
											type='submit'
											disabled={loading}
											className='w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/20 h-11 text-base font-semibold gap-2'>
											{loading ? (
												<>
													<Loader2 size={18} className='animate-spin' />
													Sending...
												</>
											) : (
												<>
													<Send size={18} />
													Send Message
												</>
											)}
										</Button>
									</form>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
