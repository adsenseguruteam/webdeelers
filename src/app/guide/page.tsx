import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Guide() {
	const steps = [
		{
			title: "Create Your Account",
			description:
				"Sign up with Google or email to get started on WebDeelers.",
		},
		{
			title: "Verify Your Identity",
			description:
				"Complete our verification process to build trust with buyers.",
		},
		{
			title: "List Your Asset",
			description:
				"Add your digital asset with detailed metrics and information.",
		},
		{
			title: "Set Your Price",
			description:
				"Determine the asking price based on market value and metrics.",
		},
		{
			title: "Receive Offers",
			description:
				"Buyers will review your listing and make purchase offers.",
		},
		{
			title: "Complete Transaction",
			description:
				"Finalize the sale and receive payment minus our 5% platform fee.",
		},
	];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 md:px-8 py-6'>
					<Link href='/'>
						<Button
							variant='ghost'
							className='text-gray-700 cursor-pointer hover:text-gray-900'>
							← Back to Home
						</Button>
					</Link>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-4xl mx-auto px-4 md:px-8 py-16'>
				<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
					Getting Started Guide
				</h1>
				<p className='text-gray-600 mb-12'>
					Learn how to buy and sell digital assets on WebDeelers
				</p>

				{/* For Sellers */}
				<section className='mb-16'>
					<h2 className='text-3xl font-bold text-gray-900 mb-8'>
						For Sellers
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{steps.map((step, index) => (
							<Card
								key={index}
								className='bg-white border-gray-200 shadow-sm'>
								<CardHeader>
									<div className='flex items-center gap-4'>
										<div className='w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold'>
											{index + 1}
										</div>
										<CardTitle className='text-gray-900'>
											{step.title}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										{step.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* For Buyers */}
				<section>
					<h2 className='text-3xl font-bold text-gray-900 mb-8'>
						For Buyers
					</h2>
					<div className='space-y-4'>
						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900'>
									Browse Listings
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									Explore our marketplace to find digital
									assets that match your investment goals and
									budget.
								</p>
							</CardContent>
						</Card>

						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900'>
									Review Details
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									Examine comprehensive metrics, performance
									data, and seller information before making a
									decision.
								</p>
							</CardContent>
						</Card>

						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900'>
									Make an Offer
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									Contact the seller or make a direct
									purchase. Our secure payment system protects
									both parties.
								</p>
							</CardContent>
						</Card>

						<Card className='bg-white border-gray-200 shadow-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900'>
									Complete Purchase
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									Finalize the transaction and receive access
									to your newly acquired digital asset.
								</p>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Platform Fee */}
				<section className='mt-16 p-6 bg-white border border-gray-200 rounded-lg'>
					<h3 className='text-2xl font-bold text-gray-900 mb-4'>
						Platform Fee
					</h3>
					<p className='text-gray-600 mb-4'>
						WebDeelers charges a 5% success fee on all completed
						transactions. This fee is deducted from the seller's
						proceeds and helps us maintain a secure, verified
						marketplace.
					</p>
					<div className='bg-slate-700 p-4 rounded-lg'>
						<p className='text-gray-200'>
							<span className='font-semibold'>Example:</span> If
							you sell an asset for $1,000, you'll receive $950
							after our 5% fee ($50).
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
