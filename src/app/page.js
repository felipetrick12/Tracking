'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Home page: Redirect users based on authentication status.
 */
const Home = () => {
	const router = useRouter();
	const { auth, loading } = useAuth();

	useEffect(() => {
		if (!loading) {
			if (auth?.user) {
				router.replace('/dashboard'); // Redirect authenticated users
			} else {
				router.replace('/login'); // Redirect unauthenticated users
			}
		}
	}, [auth?.user, loading, router]);

	if (loading) return <p>Loading...</p>; // Show loading while checking authentication

	return null; // No UI needed since it's just a redirect
};

export default Home;
