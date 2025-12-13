import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Privacy policy for Deelzo, the trusted marketplace for buying and selling digital assets.",
};
export default function Privacy() {
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Content */}
			<div className='max-w-4xl mx-auto px-4 md:px-8 py-16'>
				<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
					Privacy Policy
				</h1>
				<p className='text-gray-600 mb-8'>
					Last updated: December 2025
				</p>

				<div className='space-y-8 text-slate-600'>
					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							1. Information We Collect
						</h2>
						<p className='leading-relaxed'>
							We collect information you provide directly to us,
							such as when you create an account, list an asset,
							or contact us. This includes your name, email
							address, payment information, and any other details
							you choose to share.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							2. How We Use Your Information
						</h2>
						<p className='leading-relaxed'>
							We use the information we collect to provide,
							maintain, and improve our services, process
							transactions, send you technical notices and support
							messages, and respond to your inquiries.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							3. Data Security
						</h2>
						<p className='leading-relaxed'>
							We implement appropriate technical and
							organizational measures to protect your personal
							information against unauthorized access, alteration,
							disclosure, or destruction.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							4. Sharing of Information
						</h2>
						<p className='leading-relaxed'>
							We do not sell, trade, or rent your personal
							information to third parties. We may share
							information with service providers who assist us in
							operating our website and conducting our business.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							5. Your Rights
						</h2>
						<p className='leading-relaxed'>
							You have the right to access, update, or delete your
							personal information at any time by logging into
							your account or contacting us directly.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							6. Contact Us
						</h2>
						<p className='leading-relaxed'>
							If you have any questions about this Privacy Policy,
							please contact us at evtnorg@gmail.com
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
