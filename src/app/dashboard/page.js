'use client';

import { UserDropdown } from '@/components';
import CardMetrics from '@/components/CardMetrics';
import { LOGOUT } from '@/graphql/mutations/auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userVar } from '../ApolloConfig';

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
};

const METRICS = [
	{ label: 'Total revenue', value: '$2.6M', change: '+4.5%', changeType: 'positive' },
	{ label: 'Average order value', value: '$455', change: '-0.5%', changeType: 'negative' },
	{ label: 'Tickets sold', value: '5,888', change: '+4.5%', changeType: 'positive' },
	{ label: 'Pageviews', value: '823,067', change: '+21.2%', changeType: 'positive' }
];

const Home = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [greeting, setGreeting] = useState(getGreeting());

	const [logout] = useMutation(LOGOUT);

	useEffect(() => {
		const timer = setInterval(() => {
			setGreeting(getGreeting());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	// ✅ Función para cerrar sesión
	const handleLogout = async () => {
		try {
			await logout();

			// 🔥 Manually clear cookies in the browser
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';
			document.cookie = 'allowedRoutes=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';
			document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';

			// 🚀 Redirect to home to trigger middleware
			router.push('/');
			router.refresh(); // 🔥 Ensure middleware runs and clears allowedRoutes
			userVar(null);
		} catch (err) {
			console.error('Logout error:', err);
		}
	};

	console.log('user udashboard', user);

	return (
		<div className="p-6">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{greeting} {user?.name ? `, ${user.name}` : ''}
				</h1>
				<UserDropdown user={user} onLogout={handleLogout} />
			</div>

			{/* Metrics Section */}
			<CardMetrics metrics={METRICS} />

			{/* Recent Orders Table */}
		</div>
	);
};

export default Home;
