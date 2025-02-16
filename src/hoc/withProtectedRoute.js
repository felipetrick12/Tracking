'use client';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withProtectedRoute = (WrappedComponent, requiredRole = null) => {
	return (props) => {
		// const { auth } = useAuth();
		const router = useRouter();
		const [loading, setLoading] = useState(true);

		useEffect(() => {
			if (!auth.user) {
				// ✅ SAVE REDIRECT PATH IN LOCAL STORAGE TO REDIRECT AFTER LOGIN
				localStorage.setItem('redirectAfterLogin', router.pathname);
				router.replace('/');
			} else if (requiredRole && auth.user.role !== requiredRole) {
				// 🚀 If the user has not the role, send to the dashboard.
				router.replace('/dashboard');
			} else {
				setLoading(false);
			}
		}, [auth.user, router]);

		if (loading) {
			return <div>Loading...</div>;
		}

		return <WrappedComponent {...props} />;
	};
};

export default withProtectedRoute;
