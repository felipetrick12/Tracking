import { GET_ALL_ORDERS } from '@/graphql/queries/order';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import OrderForm from '../OrderForm';

const OrdersTable = ({ user }) => {
	const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS);
	const [selectedOrder, setSelectedOrder] = useState(null);

	// 📌 Manejo de carga y errores
	if (loading) return <p className="text-center text-gray-600">Loading orders...</p>;
	if (error) return <p className="text-center text-red-600">Error fetching orders</p>;

	// 📌 Filtrar órdenes según el rol del usuario (Admin ve todo, Cliente solo las suyas)
	const orders =
		user.role === 'admin' ? data?.getOrders : data?.getOrders.filter((order) => order.client?.id === user.id);

	// 📌 Si no hay órdenes, mostramos un mensaje amigable
	if (!orders || orders.length === 0) {
		return <p className="text-center text-gray-500">No orders found.</p>;
	}

	return (
		<>
			<h1 className="m-10 ml-0 mb-5 text-2xl font-bold">Orders</h1>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse border border-gray-300 shadow-md">
					<thead>
						<tr className="bg-gray-200 text-gray-700">
							<th className="border p-3 text-left">Order ID</th>
							<th className="border p-3 text-left">Client</th>
							<th className="border p-3 text-left">Designer</th>
							<th className="border p-3 text-left">Status</th>
							<th className="border p-3 text-left">Category</th>
							<th className="border p-3 text-left">Order Type</th>
							<th className="border p-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr
								key={order.id}
								className="hover:bg-gray-100 cursor-pointer transition"
								onClick={() => setSelectedOrder(order)}
							>
								<td className="border p-3">{order.id}</td>
								<td className="border p-3">{order.client?.name || 'N/A'}</td>
								<td className="border p-3">{order.designer?.name || 'N/A'}</td>
								<td className="border p-3">{order.status}</td>
								<td className="border p-3">{order.category?.name || 'N/A'}</td>
								<td className="border p-3">{order.orderType || 'N/A'}</td>
								<td className="border p-3">
									<button
										className="px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition"
										onClick={(e) => {
											e.stopPropagation(); // Evitar que se seleccione la fila completa
											setSelectedOrder(order);
										}}
									>
										Edit
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal para editar una orden */}
			{selectedOrder && (
				<OrderForm
					open={true}
					setOpen={() => setSelectedOrder(null)}
					order={selectedOrder}
					onOrderUpdated={refetch}
				/>
			)}
		</>
	);
};

export default OrdersTable;
