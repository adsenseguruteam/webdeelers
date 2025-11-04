import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className='bg-gray-50 border-t border-gray-200 mt-16'>
			<div className='max-w-7xl mx-auto px-4 md:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
					{/* Brand */}
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<Image
								src='/newlogo.png'
								alt='Deelzo'
								width={130}
								height={130}
							/>
						</div>
						<p className='text-gray-600 text-sm'>
							The trusted marketplace for buying and selling
							digital assets.
						</p>
					</div>

					{/* Product */}
					<div>
						<h3 className='font-semibold text-gray-900 mb-4'>
							Product
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/marketplace'
									className='text-gray-600 hover:text-blue-600 text-sm'>
									Marketplace
								</Link>
							</li>
							<li>
								<Link
									href='/guide'
									className='text-gray-600 hover:text-blue-600 text-sm'>
									How It Works
								</Link>
							</li>
							<li>
								<Link
									href='/about'
									className='text-gray-600 hover:text-blue-600 text-sm'>
									About Us
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className='font-semibold text-gray-900 mb-4'>
							Legal
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/privacy'
									className='text-gray-600 hover:text-blue-600 text-sm'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/terms'
									className='text-gray-600 hover:text-blue-600 text-sm'>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className='font-semibold text-gray-900 mb-4'>
							Support
						</h3>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/contact'
									className='text-gray-600 hover:text-blue-600 text-sm'>
									Contact Us
								</Link>
							</li>
							<li>
								<a
									href='mailto:evtnorg@gmail.com'
									className='text-gray-600 hover:text-blue-600 text-sm'>
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
							© 2025 Deelzo. All rights reserved.
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
