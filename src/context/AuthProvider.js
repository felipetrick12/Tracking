'use client';
import { GET_ME } from '@/graphql/queries/auth';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({ user: null, loading: true });
	const router = useRouter();

	const { data, loading, error } = useQuery(GET_ME, {
		fetchPolicy: 'network-only',
		credentials: 'include', // ✅ Obtener cookies en cada petición
		skip: typeof window === 'undefined' // ⛔ Evitar ejecución en SSR
	});

	console.log('Data', data);

	useEffect(() => {
		if (!loading) {
			if (data?.me) {
				setAuth({ user: data.me, loading: false });
			} else {
				setAuth({ user: null, loading: false });

				// 🚀 Redirigir a login si el usuario no tiene sesión y está en una ruta protegida
				if (window.location.pathname.startsWith('/dashboard')) {
					router.replace('/');
				}
			}
		}
	}, [data, loading]);

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
