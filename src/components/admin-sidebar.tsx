"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	FileText,
	Users,
	LogOut,
	Menu,
	X,
} from "lucide-react";
import { userContext } from "@/context/userContext";

export default function AdminSidebar() {
	const { signOut } = userContext();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	const menuItems = [
		{ icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
		{ icon: FileText, label: "Listings", href: "/admin/listings" },
		{ icon: Users, label: "Users", href: "/admin/users" },
		// { icon: MessageSquare, label: "Bids", href: "/admin/bids" },
		// { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
		// { icon: Settings, label: "Settings", href: "/admin/settings" },
	];

	const handleLogout = async () => {
		await signOut();
		window.location.href = "/";
	};

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='fixed top-4 left-4 z-50 md:hidden bg-slate-800 border border-slate-700 p-2 rounded-lg text-white'>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 p-6 z-40 transform transition-transform duration-300 md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				{/* Logo */}
				<Link href='/admin' className='flex items-center gap-2 mb-8'>
					<div className='w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center'>
						<span className='text-white font-bold text-lg'>A</span>
					</div>
					<span className='text-xl font-bold text-white'>
						AssetHub
					</span>
				</Link>

				{/* Menu Items */}
				<nav className='space-y-2 mb-8'>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link key={item.href} href={item.href}>
								<Button
									variant={isActive ? "default" : "ghost"}
									className={`w-full justify-start cursor-pointer gap-3 ${
										isActive
											? "bg-linear-to-r from-blue-500 to-cyan-500 text-white"
											: "text-slate-400 hover:text-white hover:bg-slate-800"
									}`}
									onClick={() => setIsOpen(false)}>
									<Icon size={20} />
									{item.label}
								</Button>
							</Link>
						);
					})}
				</nav>

				{/* Logout Button */}
				<div className='absolute bottom-6 left-6 right-6'>
					<Button
						onClick={handleLogout}
						className='w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white gap-2'>
						<LogOut size={20} />
						Logout
					</Button>
				</div>
			</aside>

			{/* Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/50 z-30 md:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
