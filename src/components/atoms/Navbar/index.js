'use client';

import { LOGOUT } from '@/graphql/mutations/auth';
import { GET_ME } from '@/graphql/queries/auth';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserDropdown from '../UserDropdown';

const Navbar = () => {
	const router = useRouter();

	// 🔹 Fetch authenticated user
	const { data, loading, error } = useQuery(GET_ME);
	const [logout] = useMutation(LOGOUT);

	// 🔹 Handle loading state
	if (loading) return <div className="px-6 py-4 bg-white shadow-md">Loading...</div>;

	// 🔹 Handle error state
	if (error) {
		console.error('Error fetching user:', error);
		return <div className="px-6 py-4 bg-white shadow-md text-red-500">Error loading user</div>;
	}

	// 🔹 Get authenticated user
	const user = data?.me;

	// ✅ Función para cerrar sesión
	const handleLogout = async () => {
		try {
			await logout();

			// 🔥 Manually clear cookies in the browser
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			document.cookie = 'allowedRoutes=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

			// 🚀 Redirect to home to trigger middleware
			router.push('/');
			router.refresh(); // 🔥 Ensure middleware runs and clears allowedRoutes
		} catch (err) {
			console.error('Logout error:', err);
		}
	};

	return (
		<header className="w-full px-6 py-4 bg-white flex justify-between items-center border-b border-gray-300">
			{/* ✅ Left Side: App Name */}
			<div />

			{/* ✅ Right Side: User Profile Dropdown */}
			<div className="flex items-center gap-4">
				<UserDropdown user={user} onLogout={handleLogout} />
			</div>
		</header>
	);
};

export default Navbar;
