import { CardMetrics, OrdersTable } from '@/components/atoms';
import { GET_SUPERADMIN_METRICS } from '@/graphql/queries/metrics';
import { GET_ALL_ORDERS } from '@/graphql/queries/order';
import { useQuery } from '@apollo/client';

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
			{/* Metrics for Admin */}
			<CardMetrics metrics={ADMIN_METRICS} />

			<OrdersTable
				orders={orders?.getOrders}
				user={{
					role: 'admin'
				}}
				refetchMetrics={refetch}
			/>
		</div>
	);
};

export default SuperDashboard;
