import Image from "next/image";
import Link from "next/link";
import {
	ShoppingBag,
	BookOpen,
	Info,
	Mail,
	FileText,
	Shield,
	HelpCircle,
	ArrowRight,
} from "lucide-react";

export default function Footer() {
	return (
		<footer className='bg-linear-to-br from-slate-50 via-white to-slate-100 border-t border-slate-200 mt-16'>
			<div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12'>
					{/* Brand */}
					<div className='lg:col-span-1'>
						<div className='flex items-center gap-2 mb-4'>
							<Image
								src='/newlogo.png'
								alt='Deelzo'
								width={130}
								height={130}
								className='transition-transform hover:scale-105 duration-300'
							/>
						</div>
						<p className='text-slate-600 text-sm leading-relaxed mb-4'>
							The trusted marketplace for buying and selling
							digital assets. Connect with buyers and sellers
							worldwide.
						</p>
						<div className='flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200 w-fit'>
							<div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
							<span className='text-xs font-semibold text-emerald-700'>
								Platform Fee: 5%
							</span>
						</div>
					</div>

					{/* Product */}
					<div>
						<h3 className='font-bold text-slate-900 mb-4 text-base flex items-center gap-2'>
							<ShoppingBag size={18} className='text-sky-600' />
							Product
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/marketplace'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<ArrowRight
										size={14}
										className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200'
									/>
									<span>Marketplace</span>
								</Link>
							</li>
							<li>
								<Link
									href='/guide'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<ArrowRight
										size={14}
										className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200'
									/>
									<span>How It Works</span>
								</Link>
							</li>
							<li>
								<Link
									href='/about'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<ArrowRight
										size={14}
										className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200'
									/>
									<span>About Us</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className='font-bold text-slate-900 mb-4 text-base flex items-center gap-2'>
							<Shield size={18} className='text-sky-600' />
							Legal
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/privacy'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<ArrowRight
										size={14}
										className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200'
									/>
									<span>Privacy Policy</span>
								</Link>
							</li>
							<li>
								<Link
									href='/terms'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<ArrowRight
										size={14}
										className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200'
									/>
									<span>Terms of Service</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className='font-bold text-slate-900 mb-4 text-base flex items-center gap-2'>
							<HelpCircle size={18} className='text-sky-600' />
							Support
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/contact'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<ArrowRight
										size={14}
										className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200'
									/>
									<span>Contact Us</span>
								</Link>
							</li>
							<li>
								<a
									href='mailto:evtnorg@gmail.com'
									className='group flex items-center gap-2 text-slate-600 hover:text-sky-600 text-sm transition-all duration-200'>
									<Mail
										size={14}
										className='text-slate-400 group-hover:text-sky-600 transition-colors'
									/>
									<span>Email Support</span>
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className='border-t border-slate-200 pt-8'>
					<div className='flex flex-col md:flex-row justify-between items-center gap-4'>
						<p className='text-slate-500 text-sm'>
							© 2025{" "}
							<span className='font-semibold text-slate-700'>
								Deelzo
							</span>
							. All rights reserved.
						</p>
						<div className='flex items-center gap-4 text-sm text-slate-500'>
							<span className='hidden md:inline'>Built with</span>
							<span className='text-rose-500'>♥</span>
							<span className='hidden md:inline'>
								for digital entrepreneurs
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
