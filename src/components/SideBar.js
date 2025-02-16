'use client';
import { Cog6ToothIcon, HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const SideBar = () => {
	return (
		<aside className="w-60 h-screen fixed top-0 left-0 bg-gray-900 text-white flex flex-col p-4">
			<nav className="space-y-2">
				<Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
					<HomeIcon className="w-5 h-5" />
					Dashboard
				</Link>
				<Link href="/clients" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
					<UserGroupIcon className="w-5 h-5" />
					Clients
				</Link>
				<Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
					<Cog6ToothIcon className="w-5 h-5" />
					Settings
				</Link>
			</nav>
		</aside>
	);
};

export default SideBar;
