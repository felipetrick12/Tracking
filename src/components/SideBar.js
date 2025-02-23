'use client';

import Link from 'next/link';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

// ✅ Import icons
import {
	BuildingOfficeIcon,
	ClipboardIcon,
	Cog6ToothIcon,
	HomeIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UserIcon
} from '@heroicons/react/24/outline';

const ROUTES = [
	{
		path: '/dashboard',
		label: 'Dashboard',
		icon: <HomeIcon className="w-5 h-5" />,
		roles: ['admin', 'designer', 'user']
	},
	{ path: '/clients', label: 'Clients', icon: <UserGroupIcon className="w-5 h-5" />, roles: ['admin'] },
	{ path: '/settings', label: 'Settings', icon: <Cog6ToothIcon className="w-5 h-5" />, roles: ['admin', 'designer'] },
	{ path: '/orders', label: 'Orders', icon: <ClipboardIcon className="w-5 h-5" />, roles: ['designer'] },
	{ path: '/users', label: 'Manage Users', icon: <UserIcon className="w-5 h-5" />, roles: ['admin'] },
	{
		path: '/organizations',
		label: 'Organizations',
		icon: <BuildingOfficeIcon className="w-5 h-5" />,
		roles: ['admin']
	},
	{ path: '/permissions', label: 'Permissions', icon: <ShieldCheckIcon className="w-5 h-5" />, roles: ['admin'] }
];

const SideBar = () => {
	const [allowedRoutes, setAllowedRoutes] = useState([]);

	useEffect(() => {
		// ✅ Fetch allowed routes from cookies
		const cookies = parseCookies();
		console.log('🍪 Cookies:', cookies);

		// ✅ Parse allowed routes (if exists)
		const storedRoutes = cookies.allowedRoutes ? JSON.parse(cookies.allowedRoutes) : [];

		setAllowedRoutes(storedRoutes);
	}, []);

	return (
		<aside className="w-60 h-screen fixed top-0 left-0 bg-black text-white flex flex-col p-4 border-r border-gray-700">
			<nav className="space-y-2">
				{ROUTES.filter((route) => allowedRoutes.includes(route.path)).map((route) => (
					<Link
						key={route.path}
						href={route.path}
						className="flex items-center gap-2 p-2 hover:bg-white hover:text-black rounded-md transition"
					>
						{route.icon}
						{route.label}
					</Link>
				))}
			</nav>
		</aside>
	);
};

export default SideBar;
