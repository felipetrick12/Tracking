import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_INVENTORY_ITEMS } from '@/graphql/queries/inventory';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import AddInventoryItemModal from '../AddInventoryItemModal';

const QRCodeScanner = ({ onScan }) => {
	const [scanResult, setScanResult] = useState(null);

	const handleScan = (data) => {
		console.log('handleScan called with data:', data); // Agrega esta línea
		if (data) {
			setScanResult(data);
			onScan(data);
		}
	};

	const handleError = (err) => {
		console.log('QRCodeScanner - handleError called with error:', err);
	};

	return (
		<div>
			<QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
			{scanResult && <p>Scan Result: {scanResult}</p>}
		</div>
	);
};

const InventoryTable = () => {
	const { data, loading, error, refetch } = useQuery(GET_INVENTORY_ITEMS);

	const inventory = data?.getInventoryItems || [];
	const [scannedItem, setScannedItem] = useState(null);

	const [selectedItem, setSelectedItem] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleScan = (scannedData) => {
		const foundItem = inventory.find((item) => item.qrCode === scannedData);
		setScannedItem(foundItem);
	};

	if (loading) return <p className="text-center text-muted-foreground">Loading inventory...</p>;
	if (error) return <p className="text-center text-destructive">Error loading inventory.</p>;

	const getStatusRowClass = (status) => {
		switch (status) {
			case 'assigned':
				return 'bg-green-50'; // pastel verde
			case 'damaged':
				return 'bg-red-50'; // pastel rojo
			case 'stored':
				return 'bg-blue-50'; // pastel azul
			default:
				return 'bg-purple-50'; // pastel morado
		}
	};

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-primary">Inventory Items</h1>
				<QRCodeScanner onScan={handleScan} />
			</div>

			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead># Item</TableHead>
							<TableHead>QR Code</TableHead>
							<TableHead>QR</TableHead>
							<TableHead>Image</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Designer</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{inventory.map((item) => (
							<TableRow
								key={item._id}
								className={`cursor-pointer transition hover:bg-muted ${getStatusRowClass(item.status)}`}
							>
								<TableCell>{item._id}</TableCell>
								<TableCell>{item.qrCode}</TableCell>
								<TableCell>
									{item.qrCodeImage && (
										<Image
											src={item.qrCodeImage}
											alt={`QR Code for ${item.name}`}
											width={100}
											height={100}
										/>
									)}
								</TableCell>
								<TableCell>
									{item.image && (
										<Image
											src={item.image}
											alt={`Image for ${item.name}`}
											width={100}
											height={100}
										/>
									)}
								</TableCell>
								<TableCell>{item.categoryName}</TableCell>
								<TableCell>{item.clientName}</TableCell>
								<TableCell>{item.designerName}</TableCell>
								<TableCell>{item.status}</TableCell>
								<TableCell>{item.location || '—'}</TableCell>
								<TableCell>{format(new Date(item.createdAt), 'P')}</TableCell>
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
					<h2>Scanned Item Details</h2>
					<p>Name: {scannedItem.name}</p>
					<p>Location: {scannedItem.location}</p>
					{/* ... (otros detalles del item escaneado) */}
				</Card>
			)}

			{modalOpen && (
				<AddInventoryItemModal
					open={modalOpen}
					setOpen={setModalOpen}
					item={selectedItem}
					refetchInventory={refetch}
				/>
			)}
		</>
	);
};

export default InventoryTable;
