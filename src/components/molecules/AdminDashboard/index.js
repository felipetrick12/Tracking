import { CardMetrics, OrdersTable } from '@/components/atoms';
import { GET_ADMIN_METRICS } from '@/graphql/queries/metrics';
import { useQuery } from '@apollo/client';

const AdminDashboard = () => {
	const { data, loading, error } = useQuery(GET_ADMIN_METRICS);

	if (loading) return <p>Loading metrics...</p>;
	if (error) return <p>Error fetching metrics</p>;

	const ADMIN_METRICS = [
		{ label: 'Total Users', value: data?.getAdminMetrics?.totalUsers || 0, change: '+10%', changeType: 'positive' },
		{
			label: 'Total Orders',
			value: data?.getAdminMetrics?.totalOrders || 0,
			change: '+8%',
			changeType: 'positive'
		},
		{
			label: 'Orders In Progress',
			value: data?.getAdminMetrics?.ordersInProgress || 0,
			change: '-3%',
			changeType: 'negative'
		}
	];

	return (
		<div>
			{/* Metrics for Admin */}
			<CardMetrics metrics={ADMIN_METRICS} />

			<OrdersTable
				user={{
					role: 'admin'
				}}
			/>
		</div>
	);
};

export default AdminDashboard;
