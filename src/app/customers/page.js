'use client';

import { GET_ACTIVE_ITEMS, GET_CLIENTS_BY_DESIGNER, GET_DESIGNERS } from '@/graphql/queries/user';
import { useQuery } from '@apollo/client';
import { useState } from 'react';

const CustomersPage = () => {
	// ✅ Fetch Designers
	const {
		data: designersData,
		loading,
		error
	} = useQuery(GET_DESIGNERS, {
		variables: { role: 'designer' }
	});

	// ✅ Fetch Active Items per Designer
	const { data: activeItemsData } = useQuery(GET_ACTIVE_ITEMS);

	// ✅ Fetch Clients Assigned to Designers
	const { data: clientsData } = useQuery(GET_CLIENTS_BY_DESIGNER);

	if (loading) return <p className="text-gray-500">Loading customers...</p>;
	if (error) return <p className="text-red-500">Error: {error.message}</p>;

	const designers = designersData?.getUsersByRole || [];
	const activeItems = activeItemsData?.getActiveItems || {};
	const clientsByDesigner = clientsData?.getClientsByDesigner || {};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Customers</h1>

			<table className="w-full border-collapse border border-gray-300 mt-4">
				<thead>
					<tr className="bg-gray-100">
						<th className="border p-2">Added</th>
						<th className="border p-2">Designer</th>
						<th className="border p-2">Active Items</th>
						<th className="border p-2">Account Type</th>
						<th className="border p-2">Users</th>
						<th className="border p-2">Clients</th>
						<th className="border p-2">Last Login</th>
						<th className="border p-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{designers.map((designer) => (
						<tr key={designer.id} className="border">
							<td className="border p-2">{new Date(designer.createdAt).toLocaleDateString()}</td>
							<td className="border p-2 font-bold text-gray-900">{designer.name}</td>
							<td className="border p-2 text-center">{activeItems[designer.id] || 0}</td>
							<td className="border p-2 text-center">Designer</td>
							<td className="border p-2 text-center">{(clientsByDesigner[designer.id] || []).length}</td>
							<td className="border p-2">
								{(clientsByDesigner[designer.id] || []).map((client) => client.name).join(', ') ||
									'N/A'}
							</td>
							<td className="border p-2">
								{designer.lastLogin ? new Date(designer.lastLogin).toLocaleString() : 'N/A'}
							</td>
							<td className="border p-2">
								<button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CustomersPage;
