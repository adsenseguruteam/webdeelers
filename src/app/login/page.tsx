"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ArrowRight,
	Mail,
	Lock,
	Loader2,
	Shield,
	Eye,
	EyeOff,
	AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Login() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
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
				window.location.reload();
				setTimeout(() => {
					router.push(
						data.user.role === "admin" ? "/admin" : "/dashboard"
					);
				}, 1000);
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
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 pb-24 md:pb-8'>
			<div className='w-full max-w-md'>
				<Card className='bg-white border p-0 border-slate-200 shadow-2xl overflow-hidden'>
					{/* Header with gradient */}
					<CardHeader className='bg-linear-to-r from-sky-500 via-blue-500 to-cyan-500 p-6 text-center relative overflow-hidden border-0'>
						<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl' />
						<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl' />
						<div className='relative z-10'>
							<div className='flex justify-center mb-4'>
								<div className='w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg'>
									<Shield size={32} className='text-white' />
								</div>
							</div>
							<CardTitle className='text-white text-2xl md:text-3xl font-bold mb-2'>
								Welcome Back
							</CardTitle>
							<CardDescription className='text-white/90 text-sm'>
								Login to your Deelzo account
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent className='p-6 md:p-8'>
						{error && (
							<div className='mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-2'>
								<AlertCircle
									size={18}
									className='text-rose-600 mt-0.5 shrink-0'
								/>
								<span>{error}</span>
							</div>
						)}

						<form onSubmit={handleSubmit} className='space-y-5'>
							<div>
								<Label
									htmlFor='email'
									className='text-slate-700 font-semibold text-sm mb-2 block'>
									Email Address
								</Label>
								<div className='relative'>
									<Mail
										size={18}
										className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
									/>
									<Input
										id='email'
										name='email'
										type='email'
										placeholder='you@example.com'
										value={formData.email}
										onChange={handleChange}
										required
										className='pl-10 pr-4 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor='password'
									className='text-slate-700 font-semibold text-sm mb-2 block'>
									Password
								</Label>
								<div className='relative'>
									<Lock
										size={18}
										className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
									/>
									<Input
										id='password'
										name='password'
										type={
											showPassword ? "text" : "password"
										}
										placeholder='••••••••'
										value={formData.password}
										onChange={handleChange}
										required
										className='pl-10 pr-12 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
									/>
									<button
										type='button'
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'>
										{showPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</div>

							<div className='flex items-center justify-between'>
								<Link
									href='/forgot-password'
									className='text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors'>
									Forgot password?
								</Link>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white gap-2 shadow-lg shadow-sky-500/20 h-11 text-base font-semibold'>
								{loading ? (
									<>
										<Loader2
											size={18}
											className='animate-spin'
										/>
										Logging in...
									</>
								) : (
									<>
										Login
										<ArrowRight size={18} />
									</>
								)}
							</Button>
						</form>

						<div className='mt-6 pt-6 border-t border-slate-200'>
							<p className='text-slate-600 text-sm text-center'>
								Don't have an account?{" "}
								<Link
									href='/signup'
									className='text-sky-600 hover:text-sky-700 font-semibold transition-colors'>
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
