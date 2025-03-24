'use client';

import { UserDropdown } from '@/components';
import { AdminDashboard, ClientDashboard, SuperDashboard } from '@/components/molecules';
import { LOGOUT } from '@/graphql/mutations/auth';
import { GET_ME } from '@/graphql/queries/auth';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
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
	const [greeting, setGreeting] = useState(getGreeting());
	const [logout] = useMutation(LOGOUT);

	// 🔥 Cargar datos del usuario con GET_ME
	const { data, loading, error } = useQuery(GET_ME, {
		onCompleted: (data) => {
			if (data?.me) userVar(data.me); // 🔄 Actualizar el estado reactivo
		}
	});

	const user = userVar(); // 🔥 Obtener el usuario actualizado de userVar()

	useEffect(() => {
		const timer = setInterval(() => {
			setGreeting(getGreeting());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	// ✅ Función para cerrar sesión
	const handleLogout = async () => {
		try {
			await logout(); // Llama al resolver que borra cookies httpOnly desde el backend

			// 🧹 Borrar cookies visibles desde el frontend
			destroyCookie(null, 'token');
			destroyCookie(null, 'userData');
			destroyCookie(null, 'allowedRoutes');

			// 🧠 Resetear estado global (si usás uno)
			userVar(null);

			// 🔁 Redirigir al login/home
			router.push('/');
			router.refresh();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	// 🔥 Renderizar dashboard según el rol del usuario
	const renderDashboard = () => {
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Error loading user data</p>;
		if (!user) return <p>Unauthorized</p>;

		switch (user.role) {
			case 'superadmin':
				return <SuperDashboard />;
			case 'admin':
				return <AdminDashboard />;
			case 'designer':
			case 'client':
				return <ClientDashboard />;

			default:
				return <p>Unauthorized</p>;
		}
	};

	return (
		<div className="p-6">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{greeting} {user?.name ? `, ${user.name}` : ''}
				</h1>
				<UserDropdown user={user} onLogout={handleLogout} />
			</div>

			{/* Render dinámico del Dashboard */}
			{renderDashboard()}
		</div>
	);
};

export default Dashboard;
