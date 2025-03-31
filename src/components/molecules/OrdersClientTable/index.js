import { AddClientOrderModal } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useState } from 'react';

const OrdersClientTable = ({ orders, selectedClient, refetch }) => {
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	const refetchData = async () => {
		await refetch();
	};

	const getStatusRowClass = (status) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-50'; // pastel amarillo
			case 'received':
				return 'bg-green-50'; // pastel verde
			case 'damaged':
				return 'bg-red-50'; // pastel rojo
			case 'processing':
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
			{selectedClient?.id && (
				<div className="flex justify-between items-center mb-4">
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
			)}

			{!orders ||
				(orders.length === 0 ? (
					<p className="text-center text-muted-foreground">No orders found.</p>
				) : (
					<Card className="p-4 overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Client</TableHead>
									<TableHead>Qty</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Category</TableHead>
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
										className={`cursor-pointer transition hover:bg-muted ${getStatusRowClass(
											order.status
										)}`}
										onClick={() => setSelectedOrder(order)}
									>
										<TableCell>{order.client?.name || 'N/A'}</TableCell>
										<TableCell>{order.quantity}</TableCell>
										<TableCell>{order.status}</TableCell>
										<TableCell>{order.category?.name || '—'}</TableCell>

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
				))}

			<AddClientOrderModal
				open={modalOpen}
				setOpen={setModalOpen}
				order={selectedOrder}
				selectedClient={selectedClient}
				refetch={refetchData}
			/>
		</>
	);
};

export default OrdersClientTable;
