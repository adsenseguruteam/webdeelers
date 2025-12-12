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
	Mail,
} from "lucide-react";
import { userContext } from "@/context/userContext";
import Image from "next/image";

export default function AdminSidebar() {
	const { signOut } = userContext();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	const menuItems = [
		{ icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
		{ icon: FileText, label: "Listings", href: "/admin/listings" },
		{ icon: Users, label: "Users", href: "/admin/users" },
		{ icon: Mail, label: "Emails", href: "/admin/emails" },
		// { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
		// { icon: Settings, label: "Settings", href: "/admin/settings" },
	];

	const handleLogout = async () => {
		await signOut();
		window.location.href = "/";
	};

	return (
		<>
			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm p-6 z-40 transform transition-transform duration-300 md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				{/* Logo */}
				<Link href='/' className=''>
					<Image
						src='/newlogo.png'
						alt='Deelzo'
						width={120}
						height={120}
					/>
				</Link>

				{/* Menu Items */}
				<nav className='space-y-2 mt-8 mb-8'>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link key={item.href} href={item.href}>
								<Button
									variant={isActive ? "default" : "ghost"}
									className={`w-full justify-start cursor-pointer gap-3 ${
										isActive
											? "bg-linear-to-r from-sky-500 to-blue-500 text-white"
											: "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
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
						className='w-full cursor-pointer bg-rose-500 hover:bg-rose-600 text-white gap-2'>
						<LogOut size={20} />
						Logout
					</Button>
				</div>
			</aside>

			{/* Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/30 z-30 md:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
