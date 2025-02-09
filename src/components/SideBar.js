'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
	const pathname = usePathname();

	const links = [
		{ name: 'Dashboard', href: '/' },
		{ name: 'Organizations', href: '/organizations' },
		{ name: 'Designers', href: '/designers' },
		{ name: 'Clients', href: '/clients' },
		{ name: 'Work Orders', href: '/work-orders' },
		{ name: 'Invoices', href: '/invoices' },
		{ name: 'Logout', href: '/logout' }
	];

	return (
		<aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
			<h2 className="text-xl font-bold mb-4">Admin Panel</h2>
			<nav>
				<ul className="space-y-2">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className={`block p-2 rounded-md ${
									pathname === link.href ? 'bg-blue-600' : 'hover:bg-gray-700'
								}`}
							>
								{link.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default SideBar;
