import { CardMetrics, OrdersTable } from '@/components/atoms';

const CLIENT_METRICS = [
	{ label: 'Total Clientes', value: '45', change: '+3.2%', changeType: 'positive' },
	{ label: 'Total Órdenes', value: '120', change: '+5%', changeType: 'positive' },
	{ label: 'Órdenes en Proceso', value: '8', change: '-2%', changeType: 'negative' }
];

const ClientDashboard = () => {
	return (
		<div>
			{/* Métricas del Cliente */}
			<CardMetrics metrics={CLIENT_METRICS} />

			{/* Tabla de Órdenes */}
			<OrdersTable userRole="client" />
		</div>
	);
};

export default ClientDashboard;
