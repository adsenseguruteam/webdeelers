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
	User,
	Phone,
	Loader2,
	Eye,
	EyeOff,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function SignUp() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [phone, setPhone] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

		if (!phone) {
			setError("Please enter a valid phone number with country code");
			setLoading(false);
			return;
		}

		// Update formData with the phone number from the phone input
		formData.phone = phone;

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
		<div className=' bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 pb-24 md:pb-8'>
			<div className='w-full max-w-md'>
				<Card className='bg-white border p-0 border-slate-200 shadow-2xl overflow-hidden'>
					{/* Header with gradient */}
					<CardHeader className='bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 p-6 text-center relative overflow-hidden border-0'>
						<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl' />
						<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl' />
						<div className='relative z-10'>
							<div className='flex justify-center mb-4'>
								<div className='w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg'>
									<User size={32} className='text-white' />
								</div>
							</div>
							<CardTitle className='text-white text-2xl md:text-3xl font-bold mb-2'>
								Create Account
							</CardTitle>
							<CardDescription className='text-white/90 text-sm'>
								Join Deelzo today and start trading
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
									htmlFor='name'
									className='text-slate-700 font-semibold text-sm mb-2 block'>
									Full Name
								</Label>
								<div className='relative'>
									<User
										size={18}
										className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
									/>
									<Input
										id='name'
										name='name'
										type='text'
										placeholder='John Doe'
										value={formData.name}
										onChange={handleChange}
										required
										className='pl-10 pr-4 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
									/>
								</div>
							</div>

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
									htmlFor='phone'
									className='text-slate-700 font-semibold text-sm mb-2 block'>
									Phone Number
								</Label>
								<div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all'>
									<Phone
										size={18}
										className='text-slate-400 ml-3'
									/>
									<PhoneInput
										international
										defaultCountry='IN'
										value={phone}
										placeholder='Enter phone number'
										onChange={(value) =>
											setPhone(value || "")
										}
										className='flex-1 pl-2 py-2.5 border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 w-full'
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

							<div>
								<Label
									htmlFor='confirmPassword'
									className='text-slate-700 font-semibold text-sm mb-2 block'>
									Confirm Password
								</Label>
								<div className='relative'>
									<Lock
										size={18}
										className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
									/>
									<Input
										id='confirmPassword'
										name='confirmPassword'
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										placeholder='••••••••'
										value={formData.confirmPassword}
										onChange={handleChange}
										required
										className='pl-10 pr-12 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
									/>
									<button
										type='button'
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
								{formData.password &&
									formData.confirmPassword && (
										<div className='mt-2 flex items-center gap-2'>
											{formData.password ===
											formData.confirmPassword ? (
												<>
													<CheckCircle
														size={14}
														className='text-emerald-600'
													/>
													<span className='text-xs text-emerald-600 font-medium'>
														Passwords match
													</span>
												</>
											) : (
												<>
													<AlertCircle
														size={14}
														className='text-rose-600'
													/>
													<span className='text-xs text-rose-600 font-medium'>
														Passwords do not match
													</span>
												</>
											)}
										</div>
									)}
							</div>

							<Button
								type='submit'
								disabled={
									loading ||
									formData.password !==
										formData.confirmPassword
								}
								className='w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2 shadow-lg shadow-emerald-500/20 h-11 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
								{loading ? (
									<>
										<Loader2
											size={18}
											className='animate-spin'
										/>
										Creating Account...
									</>
								) : (
									<>
										Sign Up
										<ArrowRight size={18} />
									</>
								)}
							</Button>
						</form>

						<div className='mt-6 pt-6 border-t border-slate-200'>
							<p className='text-slate-600 text-sm text-center'>
								Already have an account?{" "}
								<Link
									href='/login'
									className='text-sky-600 hover:text-sky-700 font-semibold transition-colors'>
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
