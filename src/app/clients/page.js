'use client';

import { executeGraphQL } from '@/lib/apolloServer';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const GET_DESIGNERS = gql`
	query GetDesigners($organizationId: ID!) {
		getDesigners(organizationId: $organizationId) {
			id
			name
			email
		}
	}
`;

const ClientsPage = () => {
	const [designers, setDesigners] = useState([]);
	const [selectedDesigner, setSelectedDesigner] = useState('');
	const [showModal, setShowModal] = useState(false); // Modal state

	useEffect(() => {
		async function fetchDesigners() {
			const { data, error } = await executeGraphQL(GET_DESIGNERS, { organizationId: '65a6e675437f44d70b1630ae' });

			if (!error) setDesigners(data.getDesigners);
		}
		fetchDesigners();
	}, []);

	// ✅ Function to update state when a designer is created
	const handleDesignerCreated = (newDesigner) => {
		setDesigners((prev) => [...prev, newDesigner]);
		setShowModal(false); // Close modal after creating designer
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Designers</h1>

			{/* 🔹 Button to Open Add Designer Modal */}
			{/* <AddDesignerForm onDesignerCreated={handleDesignerCreated} /> */}

			{/* 🔹 Designers Table */}
			<table className="w-full border-collapse border border-gray-300">
				<thead>
					<tr className="bg-gray-100">
						<th className="border p-2">Name</th>
						<th className="border p-2">Email</th>
					</tr>
				</thead>
				<tbody>
					{designers.map((designer) => (
						<tr key={designer.id} className="border">
							<td className="border p-2">{designer.name}</td>
							<td className="border p-2">{designer.email}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* 🔹 Add Designer Modal */}
		</div>
	);
};

export default ClientsPage;
