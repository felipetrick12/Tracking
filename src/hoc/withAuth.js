'use client';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
	return function ProtectedPage(props) {
		const router = useRouter();
		const { auth, loading } = useAuth();

		useEffect(() => {
			if (!loading && !auth?.user) {
				router.replace('/login');
			}
		}, [auth?.user, loading, router]);

		if (loading) return <p>Loading...</p>;

		return auth?.user ? <WrappedComponent {...props} /> : null;
	};
};

export default withAuth;
