"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, User } from "lucide-react";
import { userContext } from "@/context/userContext";

export default function MobileBottomNav() {
	const pathname = usePathname();
	const { user } = userContext();

	// Hide on admin pages and auth pages
	if (
		pathname?.includes("/admin") ||
		pathname?.includes("/login") ||
		pathname?.includes("/signup")
	) {
		return null;
	}

	const navItems = [
		{ icon: Home, label: "Home", href: "/" },
		{ icon: Search, label: "Browse", href: "/marketplace" },
		{
			icon: Plus,
			label: "Sell",
			href: user ? "/dashboard/create-listing" : "/login",
		},
		{
			icon: User,
			label: "Profile",
			href: user ? `/profile/${user?._id}` : "/login",
		},
		{
			icon: User,
			label: "Dashboard",
			href: user ? "/dashboard" : "/login",
		},
	];

	return (
		<nav className='fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl md:hidden z-50'>
			<div className='flex justify-around items-center h-20 px-2 pb-safe'>
				{navItems.map((item, index) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;
					return (
						<Link
							key={index}
							href={item.href}
							className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${
								isActive
									? "text-sky-600"
									: "text-slate-500 hover:text-slate-700"
							}`}>
							{isActive && (
								<div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-linear-to-r from-sky-500 to-blue-500 rounded-b-full' />
							)}
							<div
								className={`relative p-2.5 rounded-xl transition-all duration-200 ${
									isActive
										? "bg-linear-to-br from-sky-50 to-blue-50 shadow-lg shadow-sky-500/20"
										: "hover:bg-slate-50"
								}`}>
								<Icon
									size={22}
									className={`transition-transform duration-200 ${
										isActive ? "scale-110" : ""
									}`}
								/>
							</div>
							<span
								className={`text-[10px] font-semibold transition-all duration-200 ${
									isActive ? "text-sky-600" : "text-slate-500"
								}`}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
