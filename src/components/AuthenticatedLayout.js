'use client';

import SideBar from '@/components/SideBar';
import { usePathname, useRouter } from 'next/navigation';

const AuthenticatedLayout = ({ children }) => {
	const pathname = usePathname();

	// 🚀 Hide routes from sidebar
	const hideSidebarRoutes = ['/', '/signup'];

	return (
		<div className="flex h-screen bg-gray-100">
			{/* ✅ Sidebar Visibility Based on Allowed Routes */}
			{!hideSidebarRoutes.includes(pathname) && (
				<div className="w-60">
					<SideBar />
				</div>
			)}

			{/* ✅ Main Layout */}
			<div className="flex flex-col flex-1 m-2">
				<main className="rounded-md bg-white p-8">{children}</main>
			</div>
		</div>
	);
};

export default AuthenticatedLayout;
