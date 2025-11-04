import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className='bg-slate-900 border-t border-slate-800 mt-16'>
			<div className='max-w-7xl mx-auto px-4 md:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
					{/* Brand */}
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<Image
								src='/logo.png'
								alt='WebDeelers'
								width={180}
								height={180}
							/>
						</div>
						<p className='text-slate-400 text-sm'>
							The trusted marketplace for buying and selling
							digital assets.
						</p>
					</div>

					{/* Product */}
					<div>
						<h3 className='font-semibold text-white mb-4'>
							Product
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/marketplace'
									className='text-slate-400 hover:text-white text-sm'>
									Marketplace
								</Link>
							</li>
							<li>
								<Link
									href='/guide'
									className='text-slate-400 hover:text-white text-sm'>
									How It Works
								</Link>
							</li>
							<li>
								<Link
									href='/about'
									className='text-slate-400 hover:text-white text-sm'>
									About Us
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className='font-semibold text-white mb-4'>Legal</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/privacy'
									className='text-slate-400 hover:text-white text-sm'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/terms'
									className='text-slate-400 hover:text-white text-sm'>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className='font-semibold text-white mb-4'>
							Support
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/contact'
									className='text-slate-400 hover:text-white text-sm'>
									Contact Us
								</Link>
							</li>
							<li>
								<a
									href='mailto:evtnorg@gmail.com'
									className='text-slate-400 hover:text-white text-sm'>
									Email Support
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className='border-t border-slate-800 pt-8'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<p className='text-slate-400 text-sm'>
							© 2025 WebDeelers. All rights reserved.
						</p>
						<p className='text-slate-400 text-sm mt-4 md:mt-0'>
							Platform Fee: 5% on all successful transactions
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
