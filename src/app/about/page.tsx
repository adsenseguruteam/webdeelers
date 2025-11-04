import Link from "next/link";
import { Button } from "@/components/ui/button";

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
					About WebDeelers
				</h1>

				<div className='space-y-8 text-slate-600'>
					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							Our Mission
						</h2>
						<p className='leading-relaxed'>
							WebDeelers is a trusted marketplace for buying and
							selling digital assets. We empower entrepreneurs and
							digital investors to discover, evaluate, and acquire
							high-quality digital properties with confidence.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							Why Choose WebDeelers?
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
							service. Every transaction on WebDeelers is
							protected by our comprehensive verification process
							and secure payment system.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
