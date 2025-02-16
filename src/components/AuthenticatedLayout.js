'use client';

import SideBar from '@/components/SideBar';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const AuthenticatedLayout = ({ children }) => {
	const pathname = usePathname();

	// 🚀  Hide sidebar for those routes
	const hideSidebarRoutes = ['/', '/signup'];

	return (
		<div className="flex h-screen">
			{/* ✅ Sidebar (Always Left, Full Height) */}
			{!hideSidebarRoutes.includes(pathname) && (
				<div className="w-60">
					<SideBar />
				</div>
			)}

			{/* ✅ Right Section (Navbar + Main Content) */}
			<div className="flex flex-col flex-1">
				{/* ✅ Navbar (Full Width after Sidebar) */}
				{!hideSidebarRoutes.includes(pathname) && <Navbar />}

				{/* ✅ Main Content (Fills Remaining Space) */}
				<main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
			</div>
		</div>
	);
};

export default AuthenticatedLayout;
