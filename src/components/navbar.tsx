"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { userContext } from "@/context/userContext";
import Image from "next/image";

export default function Navbar() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const { user, signOut } = userContext();

	const handleLogout = async () => {
		await signOut();
		router.push("/");
	};

	return (
		<nav className='sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm'>
			<div className='max-w-7xl mx-auto px-4 md:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link href='/' className='flex items-center gap-2'>
						<Image
							src='/newlogo.png'
							alt='Deelzo'
							width={130}
							height={130}
						/>
					</Link>

					{/* Desktop Menu */}
					<div className='hidden md:flex items-center gap-8'>
						<Link
							href='/marketplace'
							className='text-gray-700 hover:text-blue-600 transition-colors'>
							Marketplace
						</Link>
						<Link
							href='/guide'
							className='text-gray-700 hover:text-blue-600 transition-colors'>
							Guide
						</Link>
						<Link
							href='/about'
							className='text-gray-700 hover:text-blue-600 transition-colors'>
							About
						</Link>
					</div>

					{/* Auth Buttons */}
					<div className='hidden md:flex items-center gap-4'>
						<>
							{user ? (
								<div className='flex items-center gap-4'>
									<Link href='/dashboard'>
										<Button className='bg-linear-to-r cursor-pointer from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
											Dashboard
										</Button>
									</Link>
									<Button
										onClick={handleLogout}
										variant='outline'
										size='icon'
										className='border-slate-600 cursor-pointer text-slate-300 hover:bg-slate-200 bg-transparent'>
										<LogOut size={20} />
									</Button>
								</div>
							) : (
								<div className='flex items-center gap-2'>
									<Link href='/login'>
										<Button
											variant='outline'
											className='border-slate-600 cursor-pointer text-slate-600 hover:text-white hover:bg-slate-800 bg-transparent'>
											Login
										</Button>
									</Link>
									<Link href='/signup'>
										<Button className='bg-linear-to-r cursor-pointer from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'>
											Sign Up
										</Button>
									</Link>
								</div>
							)}
						</>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className='md:hidden text-slate-600 hover:text-white'>
						{isOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className='md:hidden pb-4 space-y-4'>
						<Link
							href='/marketplace'
							className='block text-slate-600 hover:text-white'>
							Marketplace
						</Link>
						<Link
							href='/guide'
							className='block text-slate-600 hover:text-blue-600'>
							Guide
						</Link>
						<Button
							variant='ghost'
							className='text-slate-600 hover:bg-gray-200 hover:text-blue-600'>
							About
						</Button>
						{user ? (
							<>
								<Link href='/dashboard' className='block'>
									<Button className='w-full bg-linear-to-r from-blue-500 to-cyan-500 text-white'>
										Dashboard
									</Button>
								</Link>
								<Button
									onClick={handleLogout}
									className='w-full border-slate-600 text-slate-300 hover:bg-slate-200 bg-transparent'
									variant='outline'>
									Logout
								</Button>
							</>
						) : (
							<>
								<Link href='/login' className='block'>
									<Button
										className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-blue-600'
										variant='outline'>
										Login
									</Button>
								</Link>
								<Link href='/signup' className='block'>
									<Button className='w-full bg-linear-to-r from-blue-500 to-cyan-500 text-white'>
										Sign Up
									</Button>
								</Link>
							</>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}
