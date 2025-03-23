import { AddOrderModal } from '@/components/atoms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_ALL_ORDERS } from '@/graphql/queries/order';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useState } from 'react';

const OrdersTable = ({ user, refetchMetrics }) => {
	const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	if (loading) return <p className="text-center text-muted-foreground">Loading orders...</p>;
	if (error) return <p className="text-center text-destructive">Error fetching orders</p>;

	const orders =
		user.role === 'admin' ? data?.getOrders : data?.getOrders.filter((order) => order.client?.id === user.id);

	if (!orders || orders.length === 0) {
		return <p className="text-center text-muted-foreground">No orders found.</p>;
	}

	const refetchData = async () => {
		await refetchMetrics();
		await refetch();
	};

	return (
		<>
			<div className="flex justify-between items-center my-5">
				<h1 className="text-2xl font-bold text-primary">Orders</h1>

				<Button
					onClick={() => {
						setSelectedOrder(null);
						setModalOpen(true);
					}}
				>
					Add Order
				</Button>
			</div>

			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Item #</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Designer</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Qty</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>PO #</TableHead>
							<TableHead>Carrier</TableHead>
							<TableHead>Shipper</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Pieces</TableHead>
							<TableHead>Received</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow
								key={order.id}
								className="cursor-pointer hover:bg-muted transition"
								onClick={() => setSelectedOrder(order)}
							>
								<TableCell>{order.itemNumber || '—'}</TableCell>
								<TableCell>{order.client?.name || 'N/A'}</TableCell>
								<TableCell>{order.designer?.name || 'N/A'}</TableCell>
								<TableCell>{order.orderType}</TableCell>
								<TableCell>{order.quantity}</TableCell>
								<TableCell>{order.status}</TableCell>
								<TableCell>{order.category?.name || '—'}</TableCell>
								<TableCell>{order.poNumber || '—'}</TableCell>
								<TableCell>{order.carrier || '—'}</TableCell>
								<TableCell>{order.shipper || '—'}</TableCell>
								<TableCell>
									{order.orderType === 'delivery'
										? order.deliveryAddress
										: order.warehouseAddress || '—'}
								</TableCell>
								<TableCell>
									{order.pieces?.length
										? order.pieces.map((p) => `${p.quantity}x ${p.name}`).join(', ')
										: '—'}
								</TableCell>
								<TableCell>{order.receivedOn ? format(new Date(), 'P') : '—'}</TableCell>
								<TableCell>{format(new Date(), 'P')}</TableCell>
								<TableCell>
									<Button
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											setSelectedOrder(order);
											setModalOpen(true);
										}}
									>
										Edit
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			<AddOrderModal open={modalOpen} setOpen={setModalOpen} order={selectedOrder} refetch={refetchData} />
		</>
	);
};

export default OrdersTable;
