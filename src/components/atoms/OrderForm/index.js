'use client';

import { UPDATE_ORDER } from '@/graphql/mutations/order';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'react-toastify';

const OrderForm = ({ open, setOpen, order, onOrderUpdated }) => {
	const [formData, setFormData] = useState({ ...order });
	const [updateOrder] = useMutation(UPDATE_ORDER);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateOrder({ variables: { orderId: order.id, status: formData.status } });
			toast.success('✅ Order updated successfully!');
			setOpen(false);
			onOrderUpdated();
		} catch (error) {
			toast.error(`❌ Error: ${error.message}`);
		}
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			onClick={() => setOpen(false)}
		>
			<div
				className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-auto"
				onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic dentro del modal
			>
				<h2 className="text-xl font-bold mb-4">Edit Order</h2>
				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
					{/* Columna Izquierda */}
					<div className="flex flex-col gap-2">
						<label className="text-gray-700 font-medium text-sm">Client</label>
						<input
							type="text"
							name="client"
							value={formData.client?.name || 'N/A'}
							className="border p-2 rounded-md bg-gray-100"
							readOnly
						/>

						<label className="text-gray-700 font-medium text-sm">Designer</label>
						<input
							type="text"
							name="designer"
							value={formData.designer?.name || 'N/A'}
							className="border p-2 rounded-md bg-gray-100"
							readOnly
						/>

						<label className="text-gray-700 font-medium text-sm">Category</label>
						<input
							type="text"
							name="category"
							value={formData.category?.name || 'N/A'}
							className="border p-2 rounded-md bg-gray-100"
							readOnly
						/>

						<label className="text-gray-700 font-medium text-sm">Order Type</label>
						<input
							type="text"
							name="orderType"
							value={formData.orderType || 'N/A'}
							className="border p-2 rounded-md bg-gray-100"
							readOnly
						/>
					</div>

					{/* Columna Derecha */}
					<div className="flex flex-col gap-2">
						<label className="text-gray-700 font-medium text-sm">Status</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="border p-2 rounded-md"
						>
							<option value="pending">Pending</option>
							<option value="received">Received</option>
							<option value="processing">Processing</option>
							<option value="delivered">Delivered</option>
						</select>

						<label className="text-gray-700 font-medium text-sm">Delivery Address</label>
						<input
							type="text"
							name="deliveryAddress"
							value={formData.deliveryAddress || 'N/A'}
							className="border p-2 rounded-md bg-gray-100"
							readOnly
						/>

						<label className="text-gray-700 font-medium text-sm">Warehouse Address</label>
						<input
							type="text"
							name="warehouseAddress"
							value={formData.warehouseAddress || 'N/A'}
							className="border p-2 rounded-md bg-gray-100"
							readOnly
						/>
					</div>

					{/* Botones */}
					<div className="col-span-2 flex justify-end gap-4 mt-4">
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="bg-gray-500 text-white px-4 py-2 rounded"
						>
							Cancel
						</button>
						<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default OrderForm;
