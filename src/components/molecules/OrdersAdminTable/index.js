'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UPDATE_ORDER_STATUS } from '@/graphql/mutations/order';
import { GET_ORDERS } from '@/graphql/queries/order';
import { useToast } from '@/hooks/use-toast';
import { getStatusRowClass } from '@/utils/getStatusRowClass';
import { useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useState } from 'react';
import EditOrderModal from '../EditOrderModal';

const statusToLabel = {
	pending: 'Created',
	receiving: 'Accepted',
	shipped: 'Shipped',
	delivered: 'Delivered',
	damaged: 'Damaged'
};

const OrdersAdminTable = ({ status }) => {
	const toast = useToast();
	const { data, loading, error, refetch } = useQuery(GET_ORDERS, {
		variables: { status }
	});

	const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
	const [openEditOrderModal, setOpenEditOrderModal] = useState(false);
	const [editOrder, setEditOrder] = useState(false);

	const handleUpdateStatus = async (orderId, newStatus) => {
		try {
			await updateOrderStatus({ variables: { orderId, status: newStatus } });
			toast({ title: `✅ Order updated to ${newStatus}` });
			refetch();
		} catch (err) {
			toast({ title: `❌ Error updating status: ${err.message}` });
		}
	};

	if (loading) return <p className="text-sm text-muted-foreground">Loading orders...</p>;
	if (error) return <p className="text-sm text-red-500">Error loading orders</p>;

	const orders = data?.getOrders || [];

	return (
		<Card className="p-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Client</TableHead>
						<TableHead>Items</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>{statusToLabel[status] || 'Date'}</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id} className={getStatusRowClass(order.status)}>
							<TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
							<TableCell>{order.client?.name}</TableCell>
							<TableCell>{order.items.length}</TableCell>
							<TableCell>
								<Badge variant="">{order.status}</Badge>
							</TableCell>
							<TableCell>
								{order.status === 'pending' && order.createdAt && (
									<span className="text-sm text-muted-foreground">
										{format(new Date(order.createdAt), 'Pp')}
									</span>
								)}
								{order.status === 'receiving' && order.acceptedAt && (
									<span className="text-sm text-muted-foreground">
										{format(new Date(order.acceptedAt), 'Pp')}
									</span>
								)}
								{order.status === 'shipped' && order.shippedAt && (
									<span className="text-sm text-muted-foreground">
										{format(new Date(order.shippedAt), 'Pp')}
									</span>
								)}
								{order.status === 'delivered' && order.deliveredAt && (
									<span className="text-sm text-muted-foreground">
										{format(new Date(order.deliveredAt), 'Pp')}
									</span>
								)}
								{order.status === 'damaged' && order.damagedAt && (
									<span className="text-sm text-red-600">
										{format(new Date(order.damagedAt), 'Pp')}
									</span>
								)}
							</TableCell>

							<TableCell>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setOpenEditOrderModal(true);
											setEditOrder(order);
										}}
									>
										Edit
									</Button>
									{status === 'pending' && (
										<Button size="sm" onClick={() => handleUpdateStatus(order.id, 'receiving')}>
											Accept
										</Button>
									)}
									{status === 'receiving' && (
										<Button size="sm" onClick={() => handleUpdateStatus(order.id, 'shipped')}>
											Ship
										</Button>
									)}
									{status === 'shipped' && (
										<Button size="sm" onClick={() => handleUpdateStatus(order.id, 'delivered')}>
											Deliver
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{editOrder && (
				<EditOrderModal
					open={openEditOrderModal}
					setOpen={setOpenEditOrderModal}
					order={editOrder}
					setEditOrder={setEditOrder}
					onClose={() => setEditOrder(null)}
					refetch={refetch}
				/>
			)}
		</Card>
	);
};

export default OrdersAdminTable;
