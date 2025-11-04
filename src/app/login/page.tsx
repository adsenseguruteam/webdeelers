"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Login() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
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

		try {
			const response = await axios.post("/api/auth/login", {
				email: formData.email,
				password: formData.password,
			});

			const data = response.data;

			if (data.success) {
				localStorage.setItem("user", JSON.stringify(data.user));
				toast.success(data.message || "Login successful");
				router.push(
					data.user.role === "admin" ? "/admin" : "/dashboard"
				);
			} else {
				setError(data.message || "Login failed");
				// If unverified, prompt and redirect
				if (data.message && data.message.includes("verify")) {
					toast.error(data.message);
					router.push(
						`/verify-otp?email=${encodeURIComponent(
							formData.email
						)}`
					);
				}
			}
		} catch (err: any) {
			const res = err.response.data;
			setError(res.message || "An error occurred. Please try again.");
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
							<div className='w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center'>
								<span className='text-white font-bold text-xl'>
									A
								</span>
							</div>
						</div>
						<CardTitle className='text-gray-900 text-2xl'>
							Welcome Back
						</CardTitle>
						<p className='text-gray-600 text-sm mt-2'>
							Login to your AssetHub account
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

							<Button
								type='submit'
								disabled={loading}
								className='w-full bg-linear-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2'>
								{loading ? "Logging in..." : "Login"}
								<ArrowRight size={18} />
							</Button>
							<p className='text-right mt-1'>
								<Link
									href='/forgot-password'
									className='text-cyan-400 underline text-sm hover:text-blue-300'>
									Forgot password?
								</Link>
							</p>
						</form>

						<div className='mt-6 pt-6 border-t border-gray-200'>
							<p className='text-gray-600 text-sm text-center'>
								Don't have an account?{" "}
								<Link
									href='/signup'
									className='text-blue-400 hover:text-blue-300 font-semibold'>
									Sign up here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
