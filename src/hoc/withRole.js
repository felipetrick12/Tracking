'use client';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withRole = (WrappedComponent, allowedRoles) => {
	return function ProtectedPage(props) {
		const router = useRouter();
		const { auth, loading } = useAuth();

		useEffect(() => {
			if (!loading) {
				if (!auth?.user || !allowedRoles.includes(auth.role)) {
					router.replace('/dashboard');
				}
			}
		}, [auth?.user, auth?.role, loading, router]);

		if (loading) return <p>Loading...</p>;

		return auth?.user && allowedRoles.includes(auth.role) ? <WrappedComponent {...props} /> : null;
	};
};

export default withRole;
