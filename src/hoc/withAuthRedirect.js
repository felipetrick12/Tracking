'use client';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * HOC to redirect authenticated users away from login or public pages.
 * If the user is logged in, they are sent to `/dashboard`.
 */
const withAuthRedirect = (WrappedComponent) => {
	return function ProtectedPage(props) {
		const router = useRouter();
		const { auth, loading } = useAuth();

		console.log('auth', auth, loading);

		useEffect(() => {
			if (!loading && auth?.user) {
				router.replace('/dashboard'); // ✅ Redirect authenticated users
			}
		}, [auth?.user, loading, router]);

		if (loading) return <p>Loading...</p>; // Prevent UI flickering

		return <WrappedComponent {...props} />;
	};
};

export default withAuthRedirect;
