import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useAuth = () => {
	const [auth, setAuth] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/login'); // Redirect to login if not authenticated
		} else {
			setAuth(token);
		}
	}, [router]);

	return auth;
};

export default useAuth;
