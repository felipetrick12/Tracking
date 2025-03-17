import { CardMetrics, OrdersTable } from '@/components/atoms';

const ADMIN_METRICS = [
	{ label: 'Total Usuarios', value: '560', change: '+10%', changeType: 'positive' },
	{ label: 'Total Órdenes', value: '2,400', change: '+8%', changeType: 'positive' },
	{ label: 'Órdenes en Proceso', value: '120', change: '-3%', changeType: 'negative' }
];

const AdminDashboard = () => {
	return (
		<div>
			{/* Métricas del Admin */}
			<CardMetrics metrics={ADMIN_METRICS} />

			{/* Tabla de Órdenes para Admin */}
			<OrdersTable userRole="admin" />
		</div>
	);
};

export default AdminDashboard;
