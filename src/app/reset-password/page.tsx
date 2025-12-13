"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Lock,
	Loader2,
	CheckCircle,
	AlertCircle,
	Eye,
	EyeOff,
} from "lucide-react";

function ResetPasswordForm() {
	const params = useSearchParams();
	const email = params.get("email") || "";
	const token = params.get("token") || "";
	const [pw1, setPw1] = useState("");
	const [pw2, setPw2] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		if (!pw1 || pw1.length < 6) {
			setError("Password must be at least 6 characters.");
			setLoading(false);
			return;
		}
		if (pw1 !== pw2) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}
		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, token, password: pw1 }),
			});
			const data = await res.json();
			if (data.success) {
				setSuccess(true);
			} else {
				setError(data.message || "Reset failed.");
			}
		} catch {
			setError("Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 pb-24 md:pb-8'>
			<Card className='w-full max-w-md border p-0 border-slate-200 bg-white shadow-2xl overflow-hidden'>
				{/* Header with gradient */}
				<div className='bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-center relative overflow-hidden'>
					<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl' />
					<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl' />
					<div className='relative z-10'>
						<div className='flex justify-center mb-4'>
							<div className='w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg'>
								<Lock size={32} className='text-white' />
							</div>
						</div>
						<CardTitle className='text-white text-2xl md:text-3xl font-bold mb-2'>
							Set A New Password
						</CardTitle>
						<CardDescription className='text-white/90 text-sm'>
							Create a strong password for your account
						</CardDescription>
					</div>
				</div>

				<CardContent className='p-6 md:p-8'>
					{success ? (
						<div className='text-center space-y-4'>
							<div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto'>
								<CheckCircle
									size={32}
									className='text-emerald-600'
								/>
							</div>
							<h3 className='text-xl font-bold text-slate-900'>
								Password Reset Successful!
							</h3>
							<p className='text-slate-600 text-sm'>
								Your password has been updated. You can now
								login with your new password.
							</p>
							<Button
								className='w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/20 mt-6'
								onClick={() => router.push("/login")}>
								Go to Login
							</Button>
						</div>
					) : (
						<>
							{error && (
								<div className='mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-2'>
									<AlertCircle
										size={18}
										className='text-rose-600 mt-0.5 shrink-0'
									/>
									<span>{error}</span>
								</div>
							)}

							<form className='space-y-5' onSubmit={handleSubmit}>
								<div>
									<Label
										htmlFor='password'
										className='text-slate-700 font-semibold text-sm mb-2 block'>
										New Password
									</Label>
									<div className='relative'>
										<Lock
											size={18}
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
										/>
										<Input
											id='password'
											type={
												showPassword
													? "text"
													: "password"
											}
											required
											minLength={6}
											placeholder='Enter new password'
											disabled={loading}
											value={pw1}
											onChange={(e) =>
												setPw1(e.target.value)
											}
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
									<p className='text-xs text-slate-500 mt-1.5'>
										Must be at least 6 characters
									</p>
								</div>

								<div>
									<Label
										htmlFor='confirmPassword'
										className='text-slate-700 font-semibold text-sm mb-2 block'>
										Confirm New Password
									</Label>
									<div className='relative'>
										<Lock
											size={18}
											className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
										/>
										<Input
											id='confirmPassword'
											type={
												showConfirmPassword
													? "text"
													: "password"
											}
											required
											minLength={6}
											placeholder='Repeat new password'
											disabled={loading}
											value={pw2}
											onChange={(e) =>
												setPw2(e.target.value)
											}
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
									{pw1 && pw2 && (
										<div className='mt-2 flex items-center gap-2'>
											{pw1 === pw2 ? (
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
									disabled={
										loading || !pw1 || !pw2 || pw1 !== pw2
									}
									className='w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 h-11 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
									type='submit'>
									{loading ? (
										<>
											<Loader2
												size={18}
												className='animate-spin'
											/>
											Resetting...
										</>
									) : (
										<>
											<Lock size={18} />
											Set New Password
										</>
									)}
								</Button>
							</form>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 p-4'>
					<Card className='w-full max-w-md border border-slate-200 bg-white shadow-lg'>
						<CardContent className='p-8'>
							<div className='flex items-center justify-center'>
								<Loader2 className='h-8 w-8 animate-spin text-sky-600' />
							</div>
						</CardContent>
					</Card>
				</div>
			}>
			<ResetPasswordForm />
		</Suspense>
	);
}
