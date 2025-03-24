'use client';

import { UserDropdown } from '@/components';
import { AdminDashboard, ClientDashboard, SuperDashboard } from '@/components/molecules';
import { LOGOUT } from '@/graphql/mutations/auth';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import { userVar } from '../ApolloConfig';

const Dashboard = () => {
	const router = useRouter();
	const [logout] = useMutation(LOGOUT);
	const { user, loading } = useUser();
	const { toast } = useToast();

	const handleLogout = async () => {
		try {
			await logout();
			destroyCookie(null, 'token');
			destroyCookie(null, 'userData');
			destroyCookie(null, 'allowedRoutes');
			userVar(null);
			router.push('/');
			router.refresh();
		} catch (error) {
			toast({
				variant: 'destructive',
				title: '❌ Logout Failed',
				description: error.message
			});
		}
	};

	if (loading) return <p>Loading...</p>;
	if (!user) return <p>Unauthorized</p>;

	const renderDashboard = () => {
		switch (user.role) {
			case 'superadmin':
				return <SuperDashboard />;
			case 'admin':
				return <AdminDashboard />;
			case 'designer':
			case 'client':
				return <ClientDashboard />;
			default:
				return <p>Unauthorized</p>;
		}
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
				<UserDropdown user={user} onLogout={handleLogout} />
			</div>
			{renderDashboard()}
		</div>
	);
};

export default Dashboard;
