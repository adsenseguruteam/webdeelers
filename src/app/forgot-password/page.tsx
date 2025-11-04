"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
		<div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
			<Card className='w-full max-w-md border-gray-200 bg-white shadow-lg'>
				<CardContent className='p-8'>
					<h2 className='text-2xl font-bold mb-5 text-gray-900 text-center'>
						Reset Password
					</h2>
					{submitted ? (
						<>
							<p className='text-blue-600 text-center mb-4'>
								If an account exists for <b>{email}</b>, you'll
								soon receive an email with password reset
								instructions.
							</p>
							<Button
								className='mt-4 w-full bg-linear-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
								onClick={() => router.push("/login")}>
								Back to Login
							</Button>
						</>
					) : (
						<form className='space-y-6' onSubmit={handleSubmit}>
							<input
								type='email'
								placeholder='Email address'
								className='w-full p-3 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
								required
								autoFocus
							/>
							<Button
								type='submit'
								className='w-full bg-linear-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
								disabled={loading || !email}>
								{loading ? "Sending..." : "Send Reset Link"}
							</Button>
							{error && (
								<div className='text-red-500 text-center text-sm mt-2'>
									{error}
								</div>
							)}
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
