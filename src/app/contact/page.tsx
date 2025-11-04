"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);

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
		// In a real app, this would send to an API
		console.log("Form submitted:", formData);
		setSubmitted(true);
		setTimeout(() => {
			setFormData({ name: "", email: "", subject: "", message: "" });
			setSubmitted(false);
		}, 3000);
	};

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
					Contact Us
				</h1>
				<p className='text-gray-600 mb-12'>
					Have questions? We'd love to hear from you.
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='p-6'>
							<h3 className='text-lg font-bold text-gray-900 mb-2'>
								Email
							</h3>
							<p className='text-gray-600'>evtnorg@gmail.com</p>
						</CardContent>
					</Card>
					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='p-6'>
							<h3 className='text-lg font-bold text-gray-900 mb-2'>
								WhatsApp
							</h3>
							<p className='text-gray-600'>+91 7755089819</p>
						</CardContent>
					</Card>

					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='p-6'>
							<h3 className='text-lg font-bold text-gray-900 mb-2'>
								Response Time
							</h3>
							<p className='text-gray-600'>
								We typically respond within 12 hours
							</p>
						</CardContent>
					</Card>

					<Card className='bg-white border-gray-200 shadow-sm'>
						<CardContent className='p-6'>
							<h3 className='text-lg font-bold text-gray-900 mb-2'>
								Support Hours
							</h3>
							<p className='text-gray-600'>
								Monday - Friday: 9 AM - 6 PM IST
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
