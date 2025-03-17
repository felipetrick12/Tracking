// import UploadToS3 from '@/components/UploadToS3';
// import { GET_ORDERS, UPDATE_ORDER } from '@/graphql/queries/orders';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

const OrdersTable = ({ userRole }) => {
	const { data, loading, error } = useQuery(GET_ORDERS);
	const [updateOrder] = useMutation(UPDATE_ORDER);
	const [selectedStatus, setSelectedStatus] = useState({});

	if (loading) return <p>Loading orders...</p>;
	if (error) return <p>Error loading orders</p>;

	const handleStatusChange = (orderId, newStatus) => {
		setSelectedStatus({ ...selectedStatus, [orderId]: newStatus });
	};

	const handleSaveStatus = async (orderId) => {
		await updateOrder({ variables: { orderId, status: selectedStatus[orderId] } });
		alert('Status updated');
	};

	return (
		<div className="mt-6">
			<h2 className="text-lg font-bold mb-4">Orders</h2>
			<table className="w-full border-collapse border border-gray-200">
				<thead>
					<tr className="bg-gray-100">
						<th className="border p-2">ID</th>
						<th className="border p-2">Cliente</th>
						<th className="border p-2">Estado</th>
						<th className="border p-2">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{data.orders.map((order) => (
						<tr key={order.id} className="border">
							<td className="p-2">{order.id}</td>
							<td className="p-2">{order.clientName}</td>
							<td className="p-2">
								<select
									value={selectedStatus[order.id] || order.status}
									onChange={(e) => handleStatusChange(order.id, e.target.value)}
									className="border rounded p-1"
								>
									<option value="Pending">Pending</option>
									<option value="Processing">Processing</option>
									<option value="Completed">Completed</option>
								</select>
							</td>
							<td className="p-2">
								<button
									onClick={() => handleSaveStatus(order.id)}
									className="bg-blue-500 text-white px-3 py-1 rounded"
								>
									Save
								</button>
							</td>
							<td className="p-2">{/* <UploadToS3 orderId={order.id} /> */}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default OrdersTable;
