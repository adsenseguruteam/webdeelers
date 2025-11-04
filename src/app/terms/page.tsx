import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
					Terms of Service
				</h1>
				<p className='text-gray-600 mb-8'>Last updated: October 2024</p>

				<div className='space-y-8 text-slate-600'>
					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							1. Acceptance of Terms
						</h2>
						<p className='leading-relaxed'>
							By accessing and using WebDeelers, you accept and
							agree to be bound by the terms and provision of this
							agreement. If you do not agree to abide by the
							above, please do not use this service.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							2. Use License
						</h2>
						<p className='leading-relaxed'>
							Permission is granted to temporarily download one
							copy of the materials (information or software) on
							WebDeelers for personal, non-commercial transitory
							viewing only. This is the grant of a license, not a
							transfer of title, and under this license you may
							not:
						</p>
						<ul className='list-disc list-inside space-y-2 mt-4'>
							<li>Modify or copy the materials</li>
							<li>
								Use the materials for any commercial purpose or
								for any public display
							</li>
							<li>
								Attempt to decompile or reverse engineer any
								software contained on WebDeelers
							</li>
							<li>
								Remove any copyright or other proprietary
								notations from the materials
							</li>
							<li>
								Transfer the materials to another person or
								"mirror" the materials on any other server
							</li>
						</ul>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							3. Disclaimer
						</h2>
						<p className='leading-relaxed'>
							The materials on WebDeelers are provided on an 'as
							is' basis. AssetHub makes no warranties, expressed
							or implied, and hereby disclaims and negates all
							other warranties including, without limitation,
							implied warranties or conditions of merchantability,
							fitness for a particular purpose, or
							non-infringement of intellectual property or other
							violation of rights.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							4. Limitations
						</h2>
						<p className='leading-relaxed'>
							In no event shall AssetHub or its suppliers be
							liable for any damages (including, without
							limitation, damages for loss of data or profit, or
							due to business interruption) arising out of the use
							or inability to use the materials on AssetHub.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							5. Accuracy of Materials
						</h2>
						<p className='leading-relaxed'>
							The materials appearing on AssetHub could include
							technical, typographical, or photographic errors.
							AssetHub does not warrant that any of the materials
							on its website are accurate, complete, or current.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							6. Modifications
						</h2>
						<p className='leading-relaxed'>
							AssetHub may revise these terms of service for its
							website at any time without notice. By using this
							website, you are agreeing to be bound by the then
							current version of these terms of service.
						</p>
					</section>

					<section>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							7. Governing Law
						</h2>
						<p className='leading-relaxed'>
							These terms and conditions are governed by and
							construed in accordance with the laws of the
							jurisdiction in which AssetHub operates, and you
							irrevocably submit to the exclusive jurisdiction of
							the courts in that location.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
