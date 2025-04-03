'use client';

import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_INVENTORY_BY_CLIENT } from '@/graphql/queries/inventory';
import { QrReader } from 'react-qr-reader';
// import AddInventoryItemModal from '../AddInventoryItemModal';
// import StatusHistoryModal from './StatusHistoryModal';

const QRCodeScanner = ({ onScan }) => {
	const handleScan = (data) => {
		if (data) {
			onScan(data);
		}
	};

	const handleError = (err) => {
		console.log('QR SCAN ERROR:', err);
	};

	return (
		<QrReader
			delay={300}
			onResult={(result, error) => {
				if (!!result) {
					handleScan(result?.text);
				}
				if (!!error) {
					handleError(error);
				}
			}}
			constraints={{ facingMode: 'environment' }}
			style={{ width: '100%' }}
		/>
	);
};

const getStatusRowClass = (status) => {
	switch (status) {
		case 'pending':
			return 'bg-yellow-50';
		case 'received':
			return 'bg-blue-50';
		case 'shipped':
			return 'bg-green-50';
		case 'delivered':
		case 'complete':
			return 'bg-purple-50';
		case 'damaged':
			return 'bg-red-50';
		case 'stored':
			return 'bg-gray-50';
		default:
			return '';
	}
};

const InventoryAdminTable = () => {
	const { data, loading, error, refetch } = useQuery(GET_INVENTORY_BY_CLIENT);
	const inventory = data?.getInventoryItems || [];

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
	const [scannedItem, setScannedItem] = useState(null);

	const handleScan = (scannedData) => {
		const foundItem = inventory.find((item) => item.qrCode === scannedData);
		setScannedItem(foundItem);
	};

	if (loading) return <p className="text-center text-muted-foreground">Loading inventory...</p>;
	if (error) return <p className="text-center text-destructive">Error loading inventory.</p>;

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-primary">Inventory Items</h1>
				<Button onClick={() => setModalOpen(true)}>+ Add Item</Button>
			</div>

			<QRCodeScanner onScan={handleScan} />

			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>QR Code</TableHead>
							<TableHead>QR Image</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Designer</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>History</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{inventory.map((item) => (
							<TableRow
								key={item._id}
								className={`transition hover:bg-muted ${getStatusRowClass(item.currentStatus)}`}
							>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.qrCode}</TableCell>
								<TableCell>
									{item.qrCodeImage && (
										<Image
											src={item.qrCodeImage}
											alt="QR"
											width={60}
											height={60}
											className="rounded"
										/>
									)}
								</TableCell>
								<TableCell>{item.categoryName}</TableCell>
								<TableCell>{item.clientName}</TableCell>
								<TableCell>{item.designerName}</TableCell>
								<TableCell>{item.currentStatus}</TableCell>
								<TableCell>{item.location || '—'}</TableCell>
								<TableCell>{format(new Date(item.createdAt), 'Pp')}</TableCell>
								<TableCell>
									<Button variant="outline" size="sm" onClick={() => setSelectedItemForHistory(item)}>
										View
									</Button>
								</TableCell>
								<TableCell>
									<Button
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											setSelectedItem(item);
											setModalOpen(true);
										}}
									>
										Edit
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			{scannedItem && (
				<Card className="p-4 mt-4">
					<h2 className="font-semibold text-lg mb-2">Scanned Item</h2>
					<p>
						<strong>Name:</strong> {scannedItem.name}
					</p>
					<p>
						<strong>Status:</strong> {scannedItem.currentStatus}
					</p>
					<p>
						<strong>Location:</strong> {scannedItem.location}
					</p>
				</Card>
			)}

			{/* {modalOpen && (
				<AddInventoryItemModal
					open={modalOpen}
					setOpen={setModalOpen}
					item={selectedItem}
					refetchInventory={refetch}
				/>
			)}

			{selectedItemForHistory && (
				<StatusHistoryModal item={selectedItemForHistory} onClose={() => setSelectedItemForHistory(null)} />
			)} */}
		</>
	);
};

export default InventoryAdminTable;
