'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UPDATE_ORDER_STATUS } from '@/graphql/mutations/order';
import { GET_ORDERS } from '@/graphql/queries/order';
import { useToast } from '@/hooks/use-toast';
import { getStatusRowClass } from '@/utils/getStatusRowClass';
import { useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Inbox, Package, RefreshCw, Truck } from 'lucide-react';
import { useState } from 'react';
import EditOrderModal from '../EditOrderModal';

const statusIcons = {
	pending: <Package size={16} className="mr-2" />,
	received: <Inbox size={16} className="mr-2" />,
	shipped: <Truck size={16} className="mr-2" />,
	delivered: <CheckCircle size={16} className="mr-2" />,
	damaged: <AlertTriangle size={16} className="mr-2" />
};

const statusToLabel = {
	pending: 'Created',
	received: 'Accepted',
	shipped: 'Shipped',
	delivered: 'Delivered',
	damaged: 'Damaged'
};

const OrdersAdminTable = ({ status }) => {
	const { toast } = useToast();
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
						<TableHead>Item Number</TableHead>
						<TableHead>PO Number</TableHead>
						<TableHead>Designer</TableHead>
						<TableHead>Client</TableHead>
						<TableHead>Items</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Carrier</TableHead>
						<TableHead>Shipper</TableHead>
						<TableHead>{statusToLabel[status] || 'Date'}</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id} className={getStatusRowClass(order.status)}>
							<TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
							<TableCell>{order.itemNumber || '-'}</TableCell>
							<TableCell>{order.poNumber || '-'}</TableCell>
							<TableCell>{order.designer?.name || '-'}</TableCell>
							<TableCell>{order.client?.name || '-'}</TableCell>
							<TableCell>{order.items.length}</TableCell>
							<TableCell>
								<Badge variant="">{order.status}</Badge>
							</TableCell>
							<TableCell>{order.carrier || '-'}</TableCell>
							<TableCell>{order.shipper || '-'}</TableCell>
							<TableCell>
								<span className="text-sm text-muted-foreground">
									{format(
										new Date(
											order.status === 'received'
												? order.acceptedAt
												: order.status === 'shipped'
												? order.shippedAt
												: order.status === 'delivered'
												? order.deliveredAt
												: order.status === 'damaged'
												? order.damagedAt
												: order.createdAt
										),
										'Pp'
									)}
								</span>
							</TableCell>

							<TableCell>
								<div className="flex gap-2 flex-wrap">
									{order.status === 'pending' && (
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
									)}

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="sm">
												<RefreshCw size={14} className="mr-2" />
												Change Status
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{['pending', 'received', 'shipped', 'delivered', 'damaged'].map(
												(targetStatus) =>
													targetStatus !== order.status && (
														<DropdownMenuItem
															key={targetStatus}
															onClick={() => handleUpdateStatus(order.id, targetStatus)}
														>
															{statusIcons[targetStatus]}
															<span className="capitalize">{targetStatus}</span>
														</DropdownMenuItem>
													)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
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
