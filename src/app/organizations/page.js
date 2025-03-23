'use client';

import AddOrganizationForm from '@/components/molecules/AddOrganizationForm';
import { gql, useQuery } from '@apollo/client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_ORGANIZATIONS } from '@/graphql/queries/organization';

const OrganizationsPage = () => {
	const { data, loading, error, refetch } = useQuery(GET_ORGANIZATIONS);

	const handleOrganizationCreated = () => {
		refetch();
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Organizations</h1>
				<AddOrganizationForm onOrganizationCreated={handleOrganizationCreated} />
			</div>

			<Separator />

			{loading && <p className="text-muted-foreground">Loading organizations...</p>}
			{error && <p className="text-red-500">Error: {error.message}</p>}

			{!loading && !error && data?.getOrganizations?.length > 0 ? (
				<Card className="p-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Address</TableHead>
								<TableHead>City</TableHead>
								<TableHead>State</TableHead>
								<TableHead>Zip Code</TableHead>
								<TableHead>Phone</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.getOrganizations.map((org) => (
								<TableRow key={org.id}>
									<TableCell>{org.name}</TableCell>
									<TableCell>{org.address || 'N/A'}</TableCell>
									<TableCell>{org.city || 'N/A'}</TableCell>
									<TableCell>{org.state || 'N/A'}</TableCell>
									<TableCell>{org.zipCode || 'N/A'}</TableCell>
									<TableCell>{org.phone || 'N/A'}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			) : (
				!loading && <p className="text-muted-foreground">No organizations found.</p>
			)}
		</div>
	);
};

export default OrganizationsPage;
