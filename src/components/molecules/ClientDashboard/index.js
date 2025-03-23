import { CardMetrics } from '@/components/atoms';
import { GET_DESIGNER_METRICS } from '@/graphql/queries/metrics';
import { useQuery } from '@apollo/client';

const ClientDashboard = () => {
	const { data, loading, error } = useQuery(GET_DESIGNER_METRICS);

	if (loading) return <p>Loading metrics...</p>;
	if (error) return <p>Error fetching metrics</p>;

	const CLIENT_METRICS = [
		{
			label: 'Total Clients',
			value: data?.getDesignerMetrics?.totalClients || 0,
			change: '+3.2%',
			changeType: 'positive'
		},
		{
			label: 'Total Orders',
			value: data?.getDesignerMetrics?.totalOrders || 0,
			change: '+5%',
			changeType: 'positive'
		}
	];

	return (
		<div>
			{/* Metrics for Client */}
			<CardMetrics metrics={CLIENT_METRICS} />
		</div>	
	);
};

export default ClientDashboard;
