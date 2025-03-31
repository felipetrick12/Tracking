import { AddOrderModal } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_ALL_ORDERS } from '@/graphql/queries/order';
import { GET_USERS } from '@/graphql/queries/user';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useState } from 'react';

const OrdersTable = ({ refetchMetrics }) => {
	const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS);
	const orders = data?.getOrders || [];

	const { data: users, loading: loadingUsers } = useQuery(GET_USERS);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	if (loading) return <p className="text-center text-muted-foreground">Loading orders...</p>;
	if (error) return <p className="text-center text-destructive">Error fetching orders</p>;

	const refetchData = async () => {
		await refetchMetrics();
		await refetch();
	};

	const getStatusRowClass = (status) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-50'; // pastel amarillo
			case 'processing':
				return 'bg-green-50'; // pastel verde
			case 'damaged':
				return 'bg-red-50'; // pastel rojo
			case 'received':
				return 'bg-blue-50'; // pastel azul
			case 'complete':
			case 'delivered':
				return 'bg-purple-50'; // pastel morado
			default:
				return '';
		}
	};

	return (
		<>
			<div className="flex justify-between items-center">
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
			{orders?.length === 0 ? (
				<p className="text-center text-muted-foreground">No orders found.</p>
			) : (
				<Card className="p-4 overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Item #</TableHead>
								<TableHead>Designer</TableHead>
								<TableHead>Client</TableHead>
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
							{orders &&
								orders?.map((order) => (
									<TableRow
										key={order.id}
										className={`cursor-pointer transition hover:bg-muted ${getStatusRowClass(
											order.status
										)}`}
										onClick={() => setSelectedOrder(order)}
									>
										<TableCell>{order.itemNumber || '—'}</TableCell>
										<TableCell>{order.designer?.name || 'N/A'}</TableCell>
										<TableCell>{order.client?.name || 'N/A'}</TableCell>
										<TableCell>{order.orderType}</TableCell>
										<TableCell>{order.quantity}</TableCell>
										<TableCell>{order.status}</TableCell>
										<TableCell>{order.category?.name || '—'}</TableCell>
										<TableCell>{order.poNumber || '—'}</TableCell>
										<TableCell>
											{users?.getUsers?.find((u) => u.id === order.carrier)?.name || '—'}
										</TableCell>
										<TableCell>
											{users?.getUsers?.find((u) => u.id === order.shipper)?.name || '—'}
										</TableCell>
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
			)}
			{modalOpen && (
				<AddOrderModal open={modalOpen} setOpen={setModalOpen} order={selectedOrder} refetch={refetchData} />
			)}
		</>
	);
};

export default OrdersTable;
