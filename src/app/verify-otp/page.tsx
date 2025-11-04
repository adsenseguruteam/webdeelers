"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function VerifyOTPForm() {
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const router = useRouter();
	const params = useSearchParams();
	const email = params.get("email") || "";

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			const res = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp: code.trim() }),
			});
			const data = await res.json();
			if (data.success) {
				setSuccess(true);
				setMessage("Your email was verified! You may now log in.");
			} else {
				setMessage(data.message || "Verification failed.");
			}
		} catch {
			setMessage("Verification failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900'>
			<Card className='w-full max-w-md border-blue-700 bg-slate-900/90'>
				<CardContent className='p-8'>
					<h2 className='text-2xl font-bold mb-4 text-white text-center'>
						Verify Your AssetHub Account
					</h2>
					<p className='text-gray-700 text-center mb-7'>
						Enter the 6-digit code sent to your email{" "}
						<b className='text-blue-400'>{email}</b>
					</p>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<input
							type='text'
							pattern='[0-9]{6}'
							maxLength={6}
							disabled={loading || success}
							placeholder='OTP code'
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className='w-full p-3 rounded bg-slate-800 border border-slate-700 text-lg text-white focus:outline-none focus:border-cyan-500 text-center tracking-widest font-mono mb-2'
							autoFocus
							required
						/>
						<Button
							type='submit'
							className='w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white'
							disabled={
								loading || success || !code.match(/^[0-9]{6}$/)
							}>
							{loading
								? "Verifying..."
								: success
								? "Account Verified!"
								: "Verify"}
						</Button>
					</form>
					{message && (
						<p
							className={`mt-4 text-center text-sm ${
								success ? "text-green-400" : "text-red-400"
							}`}>
							{message}
						</p>
					)}
					{success && (
						<Button
							size='sm'
							className='mt-6 w-full bg-blue-900/80'
							onClick={() => router.push("/login")}>
							Go to Login
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default function VerifyOtpPage() {
	return (
		<Suspense
			fallback={
				<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900'>
					<Card className='w-full max-w-md border-blue-700 bg-slate-900/90'>
						<CardContent className='p-8'>
							<div className='text-white text-center'>
								Loading...
							</div>
						</CardContent>
					</Card>
				</div>
			}>
			<VerifyOTPForm />
		</Suspense>
	);
}
