import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_INVENTORY_BY_CLIENT } from '@/graphql/queries/inventory';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';

const InventoryClientTable = ({ selectedClient, selectedItems, setSelectedItems }) => {
	const { data, loading } = useQuery(GET_INVENTORY_BY_CLIENT, {
		variables: { clientId: selectedClient?.id },
		skip: !selectedClient
	});

	const inventoryItems = data?.getInventoryByClient || [];

	const isSelected = (item) => selectedItems.some((selected) => selected.id === item.id);

	const toggleItem = (item) => {
		if (isSelected(item)) {
			setSelectedItems((prev) => prev.filter((selected) => selected.id !== item.id));
		} else {
			setSelectedItems((prev) => [...prev, item]);
		}
	};

	const getStatusClass = (status) => {
		switch (status) {
			case 'stored':
				return 'bg-muted';
			case 'received':
				return 'bg-blue-50';
			case 'shipped':
				return 'bg-yellow-50';
			case 'delivered':
				return 'bg-green-50';
			case 'damaged':
				return 'bg-red-50';
			default:
				return '';
		}
	};

	return (
		<>
			{!selectedClient?.id ? (
				<p className="text-center text-muted-foreground">Select a client to view their inventory.</p>
			) : loading ? (
				<p className="text-center">Loading inventory...</p>
			) : inventoryItems.length === 0 ? (
				<p className="text-center text-muted-foreground">No items found for this client.</p>
			) : (
				<Card className="p-4 overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]">Select</TableHead>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created At</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{inventoryItems.map((item) => (
								<TableRow
									key={item.id}
									className={`transition cursor-pointer ${getStatusClass(item.currentStatus)}`}
								>
									<TableCell>
										<Checkbox checked={isSelected(item)} onCheckedChange={() => toggleItem(item)} />
									</TableCell>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.category?.name || '—'}</TableCell>
									<TableCell className="capitalize">{item.currentStatus}</TableCell>
									<TableCell>{format(new Date(item.createdAt), 'P')}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			)}
		</>
	);
};

export default InventoryClientTable;
