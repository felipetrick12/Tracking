'use client';

import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

const SideBar = () => {
	const [allowedRoutes, setAllowedRoutes] = useState([]);

	useEffect(() => {
		// 📌 Read allowed routes from cookies
		const cookies = parseCookies();
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
