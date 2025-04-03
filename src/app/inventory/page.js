'use client';

import { AddInventoryItemModal } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_ALL_INVENTORY, GET_INVENTORY_ITEM_BY_ID } from '@/graphql/queries/inventory';
import { useToast } from '@/hooks/use-toast';
import { getStatusRowClass } from '@/utils/getStatusRowClass';
import { useLazyQuery, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = ({ onScan }) => {
	const handleScan = (data) => {
		if (data) onScan(data);
	};

	const handleError = (err) => {
		console.log('QR SCAN ERROR:', err);
	};

	return (
		<QrReader
			delay={300}
			onResult={(result, error) => {
				if (!!result) handleScan(result?.text);
				if (!!error) handleError(error);
			}}
			constraints={{ facingMode: 'environment' }}
			style={{ width: '100%' }}
		/>
	);
};

const Inventory = () => {
	const { toast } = useToast();
	const { data, loading, error, refetch } = useQuery(GET_ALL_INVENTORY);
	const [getItemById, { data: scannedData }] = useLazyQuery(GET_INVENTORY_ITEM_BY_ID);

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [scannerEnabled, setScannerEnabled] = useState(false);
	const [showScannedModal, setShowScannedModal] = useState(false);

	const handleScan = (data) => {
		if (data) {
			try {
				const parsed = JSON.parse(data);
				const id = typeof parsed === 'object' && parsed.id ? parsed.id : data;
				getItemById({ variables: { id } });
				setShowScannedModal(true);
			} catch (err) {
				toast({ title: '❌ Invalid QR Code' });
			}
		}
	};

	if (loading) return <p className="text-center text-muted-foreground">Loading inventory...</p>;
	if (error) return <p className="text-center text-destructive">Error loading inventory.</p>;

	const inventory = data?.getInventoryByOrganization || [];

	return (
		<>
			<div className="flex justify-between items-center my-4">
				<h1 className="text-2xl ml-1 font-bold text-primary">Inventory</h1>
				<div className="flex gap-2">
					<Button onClick={() => setModalOpen(true)}>Create Items</Button>
					{/* <Button variant="outline" onClick={() => setScannerEnabled((prev) => !prev)}>
						{scannerEnabled ? '🛑 Stop QR Scanner' : '📷 Start QR Scanner'}
					</Button> */}
				</div>
			</div>

			{scannerEnabled && (
				<div className="my-4">
					<p className="text-sm text-muted-foreground mb-2">Scanning QR code...</p>
					<QRCodeScanner onScan={handleScan} />
				</div>
			)}

			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>QR Code</TableHead>
							<TableHead>QR Image</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Designer</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{inventory.map((item) => (
							<TableRow
								key={item.id}
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
								<TableCell>{item.category.name}</TableCell>
								<TableCell>{item.designer.name}</TableCell>
								<TableCell>{item.client.name}</TableCell>
								<TableCell>{item.currentStatus}</TableCell>
								<TableCell>{item.location || '—'}</TableCell>
								<TableCell>{format(new Date(item.createdAt), 'Pp')}</TableCell>
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

			{/* Modal para registrar ítems */}
			{modalOpen && (
				<AddInventoryItemModal open={modalOpen} setOpen={setModalOpen} item={selectedItem} refetch={refetch} />
			)}

			{/* Modal para ítem escaneado */}
			{scannedData?.getInventoryItemById && (
				<Dialog open={showScannedModal} onOpenChange={setShowScannedModal}>
					<DialogContent className="max-w-lg p-6">
						<DialogHeader>
							<DialogTitle className="text-xl">Scanned Item</DialogTitle>
						</DialogHeader>
						<div className="space-y-2 text-sm">
							<p>
								<strong>Name:</strong> {scannedData.getInventoryItemById.name}
							</p>
							<p>
								<strong>Category:</strong> {scannedData.getInventoryItemById.category.name}
							</p>
							<p>
								<strong>Client:</strong> {scannedData.getInventoryItemById.client.name}
							</p>
							<p>
								<strong>Designer:</strong> {scannedData.getInventoryItemById.designer.name}
							</p>
							<p>
								<strong>Status:</strong> {scannedData.getInventoryItemById.currentStatus}
							</p>
							<p>
								<strong>Location:</strong> {scannedData.getInventoryItemById.location}
							</p>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default Inventory;
