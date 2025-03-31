import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_INVENTORY_ITEMS } from '@/graphql/queries/inventory';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import Image from 'next/image';

const InventoryTable = () => {
	const { data, loading, error } = useQuery(GET_INVENTORY_ITEMS);
	const inventory = data?.getInventoryItems || [];

	if (loading) return <p className="text-center text-muted-foreground">Loading inventory...</p>;
	if (error) return <p className="text-center text-destructive">Error loading inventory.</p>;

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-primary">Inventory Items</h1>
			</div>

			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>QR Code</TableHead>
							<TableHead>Item Name</TableHead>
							<TableHead>Image</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Designer</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Created At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{inventory.map((item) => (
							<TableRow key={item._id}>
								<TableCell>{item.qrCode}</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell>
									{item.image && <Image src={item.image} alt={item.name} width={50} height={50} />}
								</TableCell>
								<TableCell>{item.categoryName}</TableCell>
								<TableCell>{item.clientName}</TableCell>
								<TableCell>{item.designerName}</TableCell>
								<TableCell>{item.status}</TableCell>
								<TableCell>{item.location || '—'}</TableCell>
								<TableCell>{format(new Date(item.createdAt), 'P')}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</>
	);
};

export default InventoryTable;
