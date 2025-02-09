'use client'; // ✅ This must be a client component

import SideBar from '@/components/SideBar';
import { useAuth } from '@/context/AuthContext';

const AuthenticatedLayout = ({ children }) => {
	const { auth, loading } = useAuth();

	if (loading) return <p>Loading...</p>;

	return (
		<div className="flex">
			{auth?.user && <SideBar />}
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
};

export default AuthenticatedLayout;
