import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Facebook,
	Mail,
	Phone,
	MessageCircle,
	ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default function About() {
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 md:px-8 py-6'>
					<Link href='/'>
						<Button
							variant='ghost'
							className='text-gray-700 hover:text-white'>
							← Back to Home
						</Button>
					</Link>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-4xl mx-auto px-4 md:px-8 py-16'>
				<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
					About Deelzo
				</h1>

				<div className='space-y-8 text-slate-600'>
					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							Our Mission
						</h2>
						<p className='leading-relaxed'>
							Deelzo is a trusted marketplace for buying and
							selling digital assets. We empower entrepreneurs and
							digital investors to discover, evaluate, and acquire
							high-quality digital properties with confidence.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							Why Choose Deelzo?
						</h2>
						<ul className='space-y-3'>
							<li className='flex gap-3'>
								<span className='text-blue-500 font-bold'>
									✓
								</span>
								<span>
									Verified sellers and transparent pricing
								</span>
							</li>
							<li className='flex gap-3'>
								<span className='text-blue-500 font-bold'>
									✓
								</span>
								<span>
									Comprehensive asset verification process
								</span>
							</li>
							<li className='flex gap-3'>
								<span className='text-blue-500 font-bold'>
									✓
								</span>
								<span>
									Secure transactions with escrow protection
								</span>
							</li>
							<li className='flex gap-3'>
								<span className='text-blue-500 font-bold'>
									✓
								</span>
								<span>
									Detailed performance metrics and analytics
								</span>
							</li>
							<li className='flex gap-3'>
								<span className='text-blue-500 font-bold'>
									✓
								</span>
								<span>Expert support and guidance</span>
							</li>
						</ul>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							What We Offer
						</h2>
						<p className='leading-relaxed mb-4'>
							We provide a comprehensive platform for trading
							digital assets including:
						</p>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{[
								"Websites & Blogs",
								"YouTube Channels",
								"Social Media Accounts",
								"E-commerce Stores",
								"SaaS Businesses",
								"Mobile Applications",
							].map((item) => (
								<div
									key={item}
									className='p-4 bg-white rounded-lg border border-gray-200'>
									{item}
								</div>
							))}
						</div>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							Our Commitment
						</h2>
						<p className='leading-relaxed'>
							We are committed to maintaining the highest
							standards of integrity, transparency, and customer
							service. Every transaction on Deelzo is protected by
							our comprehensive verification process and secure
							payment system.
						</p>
					</section>

					{/* About the Owner */}
					<section className='mt-16 bg-white rounded-xl shadow-sm p-8 border border-gray-100'>
						<div className='flex flex-col md:flex-row gap-8 items-center'>
							<div className='w-40 h-40 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold'>
								AG
							</div>
							<div className='flex-1'>
								<h2 className='text-2xl font-bold text-gray-900 mb-2'>
									About the Owner
								</h2>
								<p className='text-gray-600 mb-4'>
									Hi, I'm AdSense Guru aka (Amit Singh), the
									founder and CEO of Deelzo. With over 4 years
									of experience in digital marketing and
									website development, I created this platform
									to help entrepreneurs and investors find
									quality digital assets.
								</p>
								<div className='space-y-2'>
									<Link
										href='https://www.facebook.com/adsenseguruteam'
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'>
										<Facebook size={18} />
										Follow us on Facebook
									</Link>
									<div className='flex items-center gap-2 text-gray-600'>
										<Mail
											size={18}
											className='text-gray-500'
										/>
										<span>evtnorg@gmail.com</span>
									</div>
									<div className='flex items-center gap-2 text-gray-600'>
										<Phone
											size={18}
											className='text-gray-500'
										/>
										<span>+91 7755089819</span>
									</div>
								</div>
							</div>
						</div>

						{/* Social Media & Contact */}
						<div className='mt-12'>
							<h3 className='text-xl font-semibold text-gray-900 mb-6'>
								Connect With Me
							</h3>
							<div className='space-y-4'>
								{/* Website Screenshots */}
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
										<Image
											src='/page.jpg'
											alt='Dashboard Preview'
											width={500}
											height={300}
											className='w-full h-auto'
										/>
										<p className='text-center text-sm text-gray-500 p-2'>
											Facebook Page Overview
										</p>
									</div>
									<div className='rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
										<Image
											src='/group.jpg'
											alt='Marketplace Preview'
											width={500}
											height={300}
											className='w-full h-auto'
										/>
										<p className='text-center text-sm text-gray-500 p-2'>
											Facebook Group Overview
										</p>
									</div>
								</div>

								{/* WhatsApp Group */}
								<Link
									href='https://chat.whatsapp.com/BDahUf9nbFk7tY3ry27bIZ'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-green-700 transition-colors'>
									<MessageCircle className='w-5 h-5' />
									<span>Join Our WhatsApp Group</span>
								</Link>

								{/* Facebook Group */}
								<Link
									href='https://www.facebook.com/groups/adsenseguruteam'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-blue-700 transition-colors'>
									<Facebook className='w-5 h-5' />
									<span>Join Our Facebook Group</span>
								</Link>

								{/* Telegram Channel */}
								<Link
									href='https://www.deelzo.com/marketplace'
									className='flex items-center justify-center gap-2 p-4 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 text-cyan-700 transition-colors'>
									<ExternalLink className='w-5 h-5' />
									<span>Visit Marketplace</span>
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
