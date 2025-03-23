'use client';

import { Building, ClipboardList, Cog, Home, ShieldCheck, UserRound, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar';

const ROUTES = [
	{ path: '/dashboard', label: 'Home', icon: Home, roles: ['admin', 'designer', 'user'] },
	{ path: '/clients', label: 'Clients', icon: Users, roles: ['admin'] },
	{ path: '/settings', label: 'Settings', icon: Cog, roles: ['admin', 'designer'] },
	{ path: '/orders', label: 'Orders', icon: ClipboardList, roles: ['designer'] },
	{ path: '/users', label: 'Manage Users', icon: UserRound, roles: ['admin'] },
	{ path: '/organizations', label: 'Organizations', icon: Building, roles: ['admin'] },
	{ path: '/permissions', label: 'Permissions', icon: ShieldCheck, roles: ['admin'] }
];

function AppSidebar() {
	const pathname = usePathname();
	const [allowedRoutes, setAllowedRoutes] = useState([]);

	useEffect(() => {
		const cookies = parseCookies();
		const storedRoutes = cookies.allowedRoutes ? JSON.parse(cookies.allowedRoutes) : [];
		setAllowedRoutes(storedRoutes);
	}, []);

	return (
		<Sidebar className="border-r">
			{/* 🔥 Custom Header Logo Area */}
			<div className="flex items-center gap-3 mb-2 border-b px-4 py-3">
				<Image
					src={'/assets/Images/logo.png'}
					alt="Pinnacle Logo"
					width={36}
					height={36}
					className="rounded-full"
				/>
				<h1 className="text-lg font-semibold tracking-tight">Pinnacle</h1>
			</div>

			{/* ✅ Sidebar Items */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{ROUTES.filter((route) => allowedRoutes.includes(route.path)).map((route) => {
								const isActive = pathname === route.path;

								return (
									<SidebarMenuItem key={route.path} active={isActive}>
										<SidebarMenuButton asChild>
											<Link
												href={route.path}
												className={`flex items-center gap-2 p-2 pl-5 rounded-md transition font ${
													isActive
														? 'border-s-4 border-black text-black'
														: 'hover:bg-gray-300 hover:text-black text-gray-600'
												}`}
											>
												<route.icon className="h-4 w-4" />
												<span>{route.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

export default AppSidebar;
