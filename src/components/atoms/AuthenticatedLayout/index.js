'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import AppSidebar from '../Sidebar';

const AuthenticatedLayout = ({ children }) => {
	const pathname = usePathname();
	const hideSidebarRoutes = ['/', '/signup'];

	return (
		<SidebarProvider>
			<div className="flex h-screen w-screen overflow-hidden">
				{/* Sidebar */}
				{!hideSidebarRoutes.includes(pathname) && <AppSidebar />}

				{/* Main */}
				<div className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-gray-100 p-5">
					<SidebarTrigger />
					{children}
				</div>
			</div>
		</SidebarProvider>
	);
};

export default AuthenticatedLayout;
