import { Card } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

const InventoryTable = ({ orders, selectedClient, refetch }) => {
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-primary">Orders</h1>
			</div>

			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Client</TableHead>
							<TableHead>Qty</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>PO #</TableHead>
							<TableHead>Pieces</TableHead>
							<TableHead>Received</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
				</Table>
			</Card>
		</>
	);
};

export default InventoryTable;
