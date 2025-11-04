"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function SignUp() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		if (
			!formData.phone ||
			!formData.phone.startsWith("+") ||
			formData.phone.length < 10
		) {
			setError(
				"Please enter your phone number with country code, e.g. +15551234567"
			);
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post("/api/auth/signup", {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				password: formData.password,
			});

			const data = response.data;
			if (data.success) {
				if (data.next === "verify-otp") {
					toast.success(
						"Check your email for the verification code."
					);
					router.push(
						`/verify-otp?email=${encodeURIComponent(
							formData.email
						)}`
					);
				} else {
					toast.success(data.message || "Signup successful");
					setTimeout(() => {
						router.push("/login");
					}, 1200);
				}
			} else {
				setError(data.message || "Signup failed");
			}
		} catch (err: any) {
			setError(err.response.data.message || "Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24 md:pb-0'>
			<div className='w-full max-w-md'>
				<Card className='bg-white border-gray-200 shadow-lg'>
					<CardHeader className='text-center'>
						<div className='flex justify-center mb-4'>
							<div className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center'>
								<span className='text-white font-bold text-xl'>
									A
								</span>
							</div>
						</div>
						<CardTitle className='text-gray-900 text-2xl'>
							Create Account
						</CardTitle>
						<p className='text-gray-600 text-sm mt-2'>
							Join AssetHub today
						</p>
					</CardHeader>

					<CardContent>
						{error && (
							<div className='mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm'>
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<Label
									htmlFor='name'
									className='text-gray-700'>
									Full Name
								</Label>
								<div className='relative mt-2'>
									<User
										size={18}
										className='absolute left-3 top-3 text-gray-400'
									/>
									<Input
										id='name'
										name='name'
										type='text'
										placeholder='John Doe'
										value={formData.name}
										onChange={handleChange}
										required
										className='pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor='email'
									className='text-gray-700'>
									Email Address
								</Label>
								<div className='relative mt-2'>
									<Mail
										size={18}
										className='absolute left-3 top-3 text-gray-400'
									/>
									<Input
										id='email'
										name='email'
										type='email'
										placeholder='you@example.com'
										value={formData.email}
										onChange={handleChange}
										required
										className='pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor='phone'
									className='text-gray-700'>
									Phone Number
								</Label>
								<div className='relative mt-2'>
									<span className='absolute left-3 top-3 text-slate-500 text-sm'>
										+
									</span>
									<Input
										id='phone'
										name='phone'
										type='tel'
										placeholder='+917897315148'
										value={formData.phone}
										onChange={handleChange}
										required
										className='pl-8 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
										minLength={10}
										pattern='\+[0-9]{10,15}'
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor='password'
									className='text-gray-700'>
									Password
								</Label>
								<div className='relative mt-2'>
									<Lock
										size={18}
										className='absolute left-3 top-3 text-gray-400'
									/>
									<Input
										id='password'
										name='password'
										type='password'
										placeholder='••••••••'
										value={formData.password}
										onChange={handleChange}
										required
										className='pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor='confirmPassword'
									className='text-gray-700'>
									Confirm Password
								</Label>
								<div className='relative mt-2'>
									<Lock
										size={18}
										className='absolute left-3 top-3 text-gray-400'
									/>
									<Input
										id='confirmPassword'
										name='confirmPassword'
										type='password'
										placeholder='••••••••'
										value={formData.confirmPassword}
										onChange={handleChange}
										required
										className='pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
									/>
								</div>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2'>
								{loading ? "Creating Account..." : "Sign Up"}
								<ArrowRight size={18} />
							</Button>
						</form>

						<div className='mt-6 pt-6 border-t border-gray-200'>
							<p className='text-gray-600 text-sm text-center'>
								Already have an account?{" "}
								<Link
									href='/login'
									className='text-blue-400 hover:text-blue-300 font-semibold'>
									Login here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
