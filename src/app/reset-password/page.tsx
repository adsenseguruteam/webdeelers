"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
	const params = useSearchParams();
	const email = params.get("email") || "";
	const token = params.get("token") || "";
	const [pw1, setPw1] = useState("");
	const [pw2, setPw2] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
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
		<div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
			<Card className='w-full max-w-md border-gray-200 bg-white shadow-lg'>
				<CardContent className='p-8'>
					<h2 className='text-2xl font-bold mb-6 text-gray-900 text-center'>
						Set A New Password
					</h2>
					<form className='space-y-6' onSubmit={handleSubmit}>
						<input
							type='password'
							required
							minLength={6}
							placeholder='New password'
							className='w-full p-3 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
							disabled={success || loading}
							value={pw1}
							onChange={(e) => setPw1(e.target.value)}
						/>
						<input
							type='password'
							required
							minLength={6}
							placeholder='Repeat new password'
							className='w-full p-3 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
							disabled={success || loading}
							value={pw2}
							onChange={(e) => setPw2(e.target.value)}
						/>
						<Button
							disabled={loading || success || !pw1 || !pw2}
							className='w-full bg-linear-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
							type='submit'>
							{loading
								? "Resetting..."
								: success
								? "Password Reset!"
								: "Set New Password"}
						</Button>
					</form>
					{error && (
						<p className='mt-4 text-red-500 text-center text-sm'>
							{error}
						</p>
					)}
					{success && (
						<>
							<p className='mt-4 text-green-600 text-center text-sm'>
								Your password has been updated.
							</p>
							<Button
								size='sm'
								className='mt-4 w-full bg-linear-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
								onClick={() => router.push("/login")}>
								Go to Login
							</Button>
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
				<div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
					<Card className='w-full max-w-md border-gray-200 bg-white shadow-lg'>
						<CardContent className='p-8'>
							<div className='text-gray-900 text-center'>
								Loading...
							</div>
						</CardContent>
					</Card>
				</div>
			}>
			<ResetPasswordForm />
		</Suspense>
	);
}
