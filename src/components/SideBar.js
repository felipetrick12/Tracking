'use client';

import {
	BuildingOfficeIcon,
	ClipboardIcon,
	Cog6ToothIcon,
	HomeIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UserIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

const ROUTES = [
	{
		path: '/dashboard',
		label: 'Home',
		icon: HomeIcon,
		roles: ['admin', 'designer', 'user']
	},
	{ path: '/clients', label: 'Clients', icon: UserGroupIcon, roles: ['admin'] },
	{ path: '/settings', label: 'Settings', icon: Cog6ToothIcon, roles: ['admin', 'designer'] },
	{ path: '/orders', label: 'Orders', icon: ClipboardIcon, roles: ['designer'] },
	{ path: '/users', label: 'Manage Users', icon: UserIcon, roles: ['admin'] },
	{
		path: '/organizations',
		label: 'Organizations',
		icon: BuildingOfficeIcon,
		roles: ['admin']
	},
	{ path: '/permissions', label: 'Permissions', icon: ShieldCheckIcon, roles: ['admin'] }
];

const SideBar = () => {
	const [allowedRoutes, setAllowedRoutes] = useState([]);
	const pathname = usePathname();

	useEffect(() => {
		const cookies = parseCookies();
		const storedRoutes = cookies.allowedRoutes ? JSON.parse(cookies.allowedRoutes) : [];
		setAllowedRoutes(storedRoutes);
	}, []);

	return (
		<aside className="w-60 h-screen fixed top-0 left-0 bg-gray-100 text-black flex flex-col  border-r border-gray-300">
			<div className="flex items-center gap-3 mb-6 border-b-2 border-gray-200 p-4">
				<Image
					src={'/assets/Images/logo.png'}
					alt="Pinnacle Logo"
					width={40}
					height={40}
					className="rounded-full"
				/>
				<h1 className="text-xl font-bold">Pinnacle</h1>
			</div>

			<nav className="space-y-2 m-4 mt-0	">
				{ROUTES.filter((route) => allowedRoutes.includes(route.path)).map((route) => {
					const isActive = pathname === route.path;
					return (
						<Link
							key={route.path}
							href={route.path}
							className={`flex items-center gap-2 p-2 pl-5 rounded-md transition font ${
								isActive ? 'border-s-4 border-black text-black' : 'hover:bg-gray-300 hover:text-black'
							}`}
						>
							<route.icon className={`w-5 h-5 ${isActive ? 'text-red' : 'text-gray-500'} fill-black`} />
							{route.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
};

export default SideBar;
