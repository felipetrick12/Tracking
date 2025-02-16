'use client';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withPublicRoute = (WrappedComponent) => {
	return (props) => {
		const { auth } = useAuth();
		const router = useRouter();
		const [loading, setLoading] = useState(true);

		console.log('auth', auth);

		useEffect(() => {
			if (auth.user) {
				// 🚀 Si el usuario ya está autenticado, redirigirlo a /dashboard
				router.replace('/dashboard');
			} else {
				setLoading(false);
			}
		}, [auth.user, router]);

		// 🔄 Mientras valida, mostrar un loader
		if (loading) {
			return <div>Loading...</div>;
		}

		return <WrappedComponent {...props} />;
	};
};

export default withPublicRoute;
