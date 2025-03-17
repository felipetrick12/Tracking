'use client';

import AddOrganizationForm from '@/components/molecules/AddOrganizationForm';
import { gql, useQuery } from '@apollo/client';

// ✅ GraphQL Query to Get Organizations
const GET_ORGANIZATIONS = gql`
	query GetOrganizations {
		getOrganizations {
			id
			name
			address
			city
			state
			zipCode
			phone
			createdBy {
				id
				name
			}
		}
	}
`;

const OrganizationsPage = () => {
	// ✅ Use Apollo's `useQuery` to fetch organizations
	const { data, loading, error, refetch } = useQuery(GET_ORGANIZATIONS);

	// ✅ Function to refresh data when an organization is created
	const handleOrganizationCreated = () => {
		refetch(); // 🔄 Re-fetch organizations after adding a new one
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Organizations</h1>

			{/* 🔹 Add Organization Button */}
			<AddOrganizationForm onOrganizationCreated={handleOrganizationCreated} />

			{/* 🔹 Loading State */}
			{loading && <p className="text-gray-500">Loading organizations...</p>}

			{/* 🔹 Error Handling */}
			{error && <p className="text-red-500">Error: {error.message}</p>}

			{/* 🔹 Organizations Table */}
			{!loading && !error && data?.getOrganizations.length > 0 ? (
				<table className="w-full border-collapse border border-gray-300 mt-4">
					<thead>
						<tr className="bg-gray-100">
							<th className="border p-2">Name</th>
							<th className="border p-2">Address</th>
							<th className="border p-2">City</th>
							<th className="border p-2">State</th>
							<th className="border p-2">Zip Code</th>
							<th className="border p-2">Phone</th>
						</tr>
					</thead>
					<tbody>
						{data.getOrganizations.map((org) => (
							<tr key={org.id} className="border">
								<td className="border p-2">{org.name}</td>
								<td className="border p-2">{org.address || 'N/A'}</td>
								<td className="border p-2">{org.city || 'N/A'}</td>
								<td className="border p-2">{org.state || 'N/A'}</td>
								<td className="border p-2">{org.zipCode || 'N/A'}</td>
								<td className="border p-2">{org.phone || 'N/A'}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				!loading && <p className="text-gray-500">No organizations found.</p>
			)}
		</div>
	);
};

export default OrganizationsPage;
