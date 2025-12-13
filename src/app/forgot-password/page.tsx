"use client";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
	Mail,
	Loader2,
	CheckCircle,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			setSubmitted(true);
		} catch {
			setError("Something went wrong, try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 pb-24 md:pb-8'>
			<Card className='w-full max-w-md p-0 border border-slate-200 bg-white shadow-2xl overflow-hidden'>
				{/* Header with gradient */}
				<div className='bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 p-6 text-center relative overflow-hidden'>
					<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl' />
					<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl' />
					<div className='relative z-10'>
						<div className='flex justify-center mb-4'>
							<div className='w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg'>
								<Mail size={32} className='text-white' />
							</div>
						</div>
						<CardTitle className='text-white text-2xl md:text-3xl font-bold mb-2'>
							Reset Password
						</CardTitle>
						<CardDescription className='text-white/90 text-sm'>
							Enter your email to receive reset instructions
						</CardDescription>
					</div>
				</div>

				<CardContent className='p-6 md:p-8'>
					{submitted ? (
						<div className='text-center space-y-4'>
							<div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto'>
								<CheckCircle
									size={32}
									className='text-emerald-600'
								/>
							</div>
							<h3 className='text-xl font-bold text-slate-900'>
								Check Your Email
							</h3>
							<p className='text-slate-600 text-sm leading-relaxed'>
								If an account exists for{" "}
								<strong className='text-slate-900'>
									{email}
								</strong>
								, you'll soon receive an email with password
								reset instructions.
							</p>
							<Button
								className='w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/20 mt-6 gap-2'
								onClick={() => router.push("/login")}>
								<ArrowLeft size={18} />
								Back to Login
							</Button>
						</div>
					) : (
						<form className='space-y-5' onSubmit={handleSubmit}>
							{error && (
								<div className='p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-2'>
									<AlertCircle
										size={18}
										className='text-rose-600 mt-0.5 shrink-0'
									/>
									<span>{error}</span>
								</div>
							)}

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
										type='email'
										placeholder='you@example.com'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										disabled={loading}
										required
										autoFocus
										className='pl-10 pr-4 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20'
									/>
								</div>
							</div>

							<Button
								type='submit'
								disabled={loading || !email}
								className='w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 h-11 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed gap-2'>
								{loading ? (
									<>
										<Loader2
											size={18}
											className='animate-spin'
										/>
										Sending...
									</>
								) : (
									<>
										<Mail size={18} />
										Send Reset Link
									</>
								)}
							</Button>

							<div className='pt-4 border-t border-slate-200'>
								<Button
									variant='ghost'
									onClick={() => router.push("/login")}
									className='w-full text-slate-600 hover:text-slate-900 gap-2'>
									<ArrowLeft size={18} />
									Back to Login
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
