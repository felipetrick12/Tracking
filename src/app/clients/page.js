'use client';

import { GET_ME } from '@/graphql/queries/auth';
import { GET_ORDERS_BY_DESIGNER } from '@/graphql/queries/order';
import { GET_USERS_BY_ROLE } from '@/graphql/queries/user';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

const ClientsPage = () => {
	const { data: userData } = useQuery(GET_ME); // Obtiene el usuario autenticado

	console.log('userData?.me?', userData?.me);

	const {
		data: designersData,
		refetch,
		loading: loadingDesigners,
		error: errorDesigners
	} = useQuery(GET_USERS_BY_ROLE, {
		variables: { role: 'designer', organizationId: userData?.me?.activeOrganization?.id },
		skip: !userData?.me?.activeOrganization?.id // Evita ejecutar si no hay activeOrganization
	});

	const [selectedDesigner, setSelectedDesigner] = useState(null);

	// 🔹 Cargar órdenes activas cuando cambia el diseñador seleccionado
	const {
		data: ordersData,
		loading: loadingOrders,
		error: errorOrders
	} = useQuery(GET_ORDERS_BY_DESIGNER, {
		variables: { designerId: selectedDesigner },
		skip: !selectedDesigner // No ejecutar la query si no hay diseñador seleccionado
	});

	console.log('designersData', ordersData);

	const designers = designersData?.getUsersByRole || [];
	const orders = ordersData?.getOrdersByDesigner || [];

	console.log('selectedDesigner', selectedDesigner);

	return (
		<div className="flex h-screen">
			{/* 🔹 Sidebar de Diseñadores */}
			<div className="w-1/4 bg-gray-100 p-4 border-r overflow-auto">
				<h2 className="text-lg font-bold mb-3">Designers</h2>
				{loadingDesigners ? (
					<p>Loading designers...</p>
				) : errorDesigners ? (
					<p className="text-red-500">Error loading designers</p>
				) : (
					<ul>
						{designers.map((designer) => (
							<li
								key={designer.id}
								onClick={() => setSelectedDesigner(designer.id)}
								className={`p-2 cursor-pointer rounded-md ${
									selectedDesigner === designer.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
								}`}
							>
								{designer.name}
							</li>
						))}
					</ul>
				)}
			</div>

			{/* 🔹 Contenedor de Órdenes Activas */}
			<div className="w-3/4 p-6">
				<h2 className="text-lg font-bold mb-3">Active Orders</h2>
				{!selectedDesigner ? (
					<p className="text-gray-500">Select a designer to view active orders</p>
				) : loadingOrders ? (
					<p>Loading orders...</p>
				) : errorOrders ? (
					<p className="text-red-500">Error loading orders</p>
				) : orders.length === 0 ? (
					<p className="text-gray-500">No active orders for this designer</p>
				) : (
					<table className="w-full border-collapse border border-gray-300 mt-4">
						<thead>
							<tr className="bg-gray-100">
								<th className="border p-2">Client</th>
								<th className="border p-2">Description</th>
								<th className="border p-2">Category</th>
								<th className="border p-2">Quantity</th>
								<th className="border p-2">Received On</th>
								<th className="border p-2">Status</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order.id} className="border">
									<td className="border p-2">{order.client.name}</td>
									<td className="border p-2">{order.description}</td>
									<td className="border p-2">{order.category.name}</td>
									<td className="border p-2">{order.quantity}</td>
									<td className="border p-2">{new Date(order.receivedOn).toLocaleDateString()}</td>
									<td className="border p-2 capitalize">{order.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default ClientsPage;
