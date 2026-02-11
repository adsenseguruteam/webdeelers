"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Plus,
	BookOpen,
	TrendingUp,
	LogOut,
	Menu,
	X,
	User,
	ShoppingBag,
	FileText,
	ChevronRight,
	Star,
} from "lucide-react";
import { userContext } from "@/context/userContext";
import Image from "next/image";

export default function DashboardSidebar() {
	const { signOut, user } = userContext();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	const menuItems = [
		{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
		{ icon: Plus, label: "Create Listing", href: "/dashboard/create-listing" },
		{ icon: BookOpen, label: "My Blogs", href: "/dashboard/blogs" },
		{ icon: FileText, label: "Add Blog", href: "/dashboard/add-blog" },
		{ icon: TrendingUp, label: "Upgrade Plan", href: "/dashboard/upgrade" },
	];

	const handleLogout = async () => {
		await signOut();
		window.location.href = "/";
	};

	return (
		<>
			{/* Mobile Menu Toggle */}
			<Button
				variant='ghost'
				size='icon'
				className='fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg border border-slate-200 hover:bg-slate-50'
				onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</Button>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-slate-50 via-white to-slate-50 border-r border-slate-200/80 shadow-xl p-6 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				{/* Logo Section */}
				<div className='mb-8'>
					<Link href='/' className='block mb-6'>
						<Image
							src='/newlogo.png'
							alt='Deelzo'
							width={120}
							height={120}
							className='transition-transform hover:scale-105'
						/>
					</Link>

					{/* User Profile Section */}
					{user && (
						<div className='bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100/50 shadow-sm'>
							<div className='flex items-center gap-3'>
								<div className='relative'>
									<div className='w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md'>
										{user.name?.charAt(0).toUpperCase() || "U"}
									</div>
									<div className='absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm'></div>
								</div>
								<div className='flex-1 min-w-0'>
									<p className='font-semibold text-slate-900 truncate text-sm'>
										{user.name || "User"}
									</p>
									<div className='flex items-center gap-1 mt-0.5'>
										<Star
											size={12}
											className='text-amber-500 fill-amber-500'
										/>
										<p className='text-xs text-slate-600 truncate'>
											{(user as any).plan || "Free Plan"}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Menu Items */}
				<nav className='space-y-1.5 mb-8 flex-1'>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link key={item.href} href={item.href}>
								<Button
									variant='ghost'
									className={`w-full justify-start cursor-pointer gap-3 h-11 relative group transition-all duration-200 ${
										isActive
											? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600"
											: "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
										}`}
										onClick={() => setIsOpen(false)}>
									<Icon
										size={20}
										className={`transition-transform group-hover:scale-110 ${
											isActive
												? "text-white"
												: "text-slate-600 group-hover:text-slate-900"
											}`}
									/>
									<span className='font-medium'>
										{item.label}
									</span>
									{isActive && (
										<ChevronRight
											size={16}
											className='ml-auto text-white opacity-80'
										/>
									)}
									{isActive && (
										<div className='absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full'></div>
									)}
								</Button>
							</Link>
						);
					})}
				</nav>

				{/* Quick Actions */}
				<div className='mb-6'>
					<p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3'>
						Quick Actions
					</p>
					<div className='space-y-2'>
						<Link href={`/profile/${user?._id}`}>
							<Button
								variant='ghost'
								className='w-full justify-start gap-3 h-10 text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'>
								<User size={18} className='text-slate-500' />
								<span className='font-medium'>My Profile</span>
							</Button>
						</Link>
						<Link href='/marketplace'>
							<Button
								variant='ghost'
								className='w-full justify-start gap-3 h-10 text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'>
								<ShoppingBag size={18} className='text-slate-500' />
								<span className='font-medium'>Marketplace</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Logout Button */}
				<div className='absolute bottom-6 left-6 right-6'>
					<Button
						onClick={handleLogout}
						className='w-full cursor-pointer bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white gap-2 shadow-lg shadow-rose-500/20 transition-all duration-200 h-11 font-medium'>
						<LogOut size={20} />
						<span>Logout</span>
					</Button>
				</div>
			</aside>

			{/* Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
