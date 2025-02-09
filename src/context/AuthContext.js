'use client';
import { GET_ME } from '@/graphql/queries/auth';
import { useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({ user: null, role: null });
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const { data, refetch } = useQuery(GET_ME, {
		skip: typeof window === 'undefined' || !localStorage.getItem('token')
	});

	useEffect(() => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

		if (!token) {
			setAuth({ user: null, role: null });
			setLoading(false);
			return;
		}

		const decodedUser = jwtDecode(token);
		setAuth({ user: decodedUser, role: decodedUser.role });

		refetch()
			.then((res) => {
				if (!res.data?.me) {
					localStorage.removeItem('token');
					setAuth({ user: null, role: null });
					router.replace('/login');
				}
			})
			.catch(() => {
				localStorage.removeItem('token');
				setAuth({ user: null, role: null });
				router.replace('/login');
			});

		setLoading(false);
	}, [data]);

	return <AuthContext.Provider value={{ auth, loading, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
