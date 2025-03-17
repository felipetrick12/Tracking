'use client';

import { UserDropdown } from '@/components';
import { AdminDashboard, ClientDashboard } from '@/components/molecules';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userVar } from '../ApolloConfig';

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
};

const Dashboard = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [greeting, setGreeting] = useState(getGreeting());

	useEffect(() => {
		const timer = setInterval(() => {
			setGreeting(getGreeting());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	console.log('User in Dashboard:', user);

	// 🔥 Renderizar dashboard según el rol del usuario
	const renderDashboard = () => {
		if (!user) return <p>Loading...</p>;
		if (user.role === 'admin') return <AdminDashboard />;
		if (user.role === 'client') return <ClientDashboard />;
		return <p>Unauthorized</p>;
	};

	return (
		<div className="p-6">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{greeting} {user?.name ? `, ${user.name}` : ''}
				</h1>
				<UserDropdown user={user} />
			</div>

			{/* Render dinámico del Dashboard */}
			{renderDashboard()}
		</div>
	);
};

export default Dashboard;
