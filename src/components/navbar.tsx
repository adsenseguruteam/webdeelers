"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, CircleUserRound } from "lucide-react";
import { userContext } from "@/context/userContext";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
							width={120}
							height={120}
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
							href='/contact'
							className='text-gray-700 hover:text-blue-600 transition-colors'>
							Contact
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
					<div className='md:hidden'>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<CircleUserRound />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{user && (
									<>
										<DropdownMenuItem>
											<Link href='/dashboard'>
												Dashboard
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Link
												href={`/profile/${user?._id}`}>
												Profile
											</Link>
										</DropdownMenuItem>
									</>
								)}
								<DropdownMenuItem>
									<Link href='/marketplace'>Marketplace</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href='/guide'>Guide</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href='/dashboard/create-listing'>
										Sell
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href='/contact'>Contact</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href='/about'>About</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{user && user ? (
									<DropdownMenuItem onClick={handleLogout}>
										Logout
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem>
										<Link href='/login'>Login</Link>
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	);
}
