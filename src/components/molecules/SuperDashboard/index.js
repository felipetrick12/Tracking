import { CardMetrics } from '@/components/atoms';
import { AddTypeModal, OrdersTable } from '@/components/molecules';
import { GET_SUPERADMIN_METRICS } from '@/graphql/queries/metrics';
import { GET_ALL_ORDERS } from '@/graphql/queries/order';
import { useQuery } from '@apollo/client';
import { Boxes, UserCog } from 'lucide-react';

const SuperDashboard = () => {
	const { data, loading, error, refetch } = useQuery(GET_SUPERADMIN_METRICS);
	const { data: orders } = useQuery(GET_ALL_ORDERS);

	if (loading) return <p>Loading metrics...</p>;
	if (error) return <p>Error fetching metrics</p>;

	const ADMIN_METRICS = [
		{
			label: 'Total Users',
			value: data?.getSuperAdminMetrics?.totalUsers || 0,
			change: '+10%',
			changeType: 'positive'
		},
		{
			label: 'Total Orders',
			value: data?.getSuperAdminMetrics?.totalOrders || 0,
			change: '+8%',
			changeType: 'positive'
		},
		{
			label: 'Orders In Progress',
			value: data?.getSuperAdminMetrics?.ordersInProgress || 0,
			change: '-3%',
			changeType: 'negative'
		}
	];

	return (
		<div>
			<div className="space-y-10">
				{/* Metrics for Admin */}
				<CardMetrics metrics={ADMIN_METRICS} />

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					<AddTypeModal icon={() => <Boxes size={40} />} title="Create Category" typeLabel="category" />

					<AddTypeModal icon={() => <UserCog size={40} />} title="Create Role" typeLabel="roles" />
				</div>

				<OrdersTable orders={orders?.getOrders} refetchMetrics={refetch} />
			</div>
		</div>
	);
};

export default SuperDashboard;
