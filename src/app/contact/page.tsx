import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us",
	description:
		"Contact us for any questions or support. We are here to help you.",
};
export default function Contact() {
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
		<div className='bg-linear-to-br from-slate-50 via-white to-slate-100'>
			{/* Hero Section */}
			<div className='relative overflow-hidden bg-linear-to-r from-sky-500 via-blue-500 to-cyan-500 py-12 md:py-16'>
				<div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
				<div className='max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10'>
					<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
						Contact Us
					</h1>
					<p className='text-white/90 text-lg md:text-xl max-w-2xl mx-auto'>
						Have questions? We'd love to hear from you. Get in touch
						and we'll respond as soon as possible.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16'>
				<div className='grid grid-cols-2 gap-6'>
					{contactInfo.map((info, index) => {
						const Icon = info.icon;
						return (
							<Card
								key={index}
								className={`bg-linear-to-br ${
									info.bgColor
								} border ${
									info.borderColor
								} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
									info.href ? "cursor-pointer" : ""
								}`}>
								<CardContent className='p-6'>
									<div className='flex items-start gap-4'>
										<div
											className={`w-12 h-12 rounded-xl bg-linear-to-br ${info.color} flex items-center justify-center shrink-0`}>
											<Icon
												size={24}
												className='text-white'
											/>
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
												<p
													className={`${info.textColor} text-sm font-medium`}>
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
			</div>
		</div>
	);
}
