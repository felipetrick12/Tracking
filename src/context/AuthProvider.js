'use client';
import { GET_ME } from '@/graphql/queries/auth';
import { useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({ user: null, loading: true });

	// 🚀 Solo hacemos la consulta si el middleware ya ha validado el usuario
	const { data, loading, error } = useQuery(GET_ME, {
		fetchPolicy: 'cache-first', // ✅ Usa caché si ya hizo la consulta antes
		credentials: 'include',
		skip: typeof window === 'undefined' // ⛔ Evita ejecutar en SSR
	});

	useEffect(() => {
		if (!loading) {
			if (data?.me) {
				setAuth({ user: data.me, loading: false });
			} else {
				setAuth({ user: null, loading: false });
			}
		}
	}, [data, loading]);

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
