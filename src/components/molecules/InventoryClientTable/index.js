import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_INVENTORY_BY_CLIENT } from '@/graphql/queries/inventory';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';

import { useState } from 'react';

const ImageSlider = ({ images = [], height = 'h-20', width = 'w-20', rounded = 'rounded-md' }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!images.length) return <span className="text-xs text-muted-foreground italic">No image</span>;

	const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);

	return (
		<div className={`relative flex items-center justify-center ${height} ${width}`}>
			<img
				src={images[currentIndex]}
				alt={`Slide ${currentIndex + 1}`}
				className={`object-cover ${height} ${width} ${rounded} border`}
			/>
			{images.length > 1 && (
				<>
					<button
						type="button"
						onClick={prev}
						className="absolute left-0 bg-white bg-opacity-50 p-1 text-xs rounded-full"
					>
						◀
					</button>
					<button
						type="button"
						onClick={next}
						className="absolute right-0 bg-white bg-opacity-50 p-1 text-xs rounded-full"
					>
						▶
					</button>
				</>
			)}
		</div>
	);
};

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
								<TableHead className="w-[100px]">Image</TableHead>
								<TableHead>ID</TableHead>
								<TableHead>Name & Pieces</TableHead>
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

									<TableCell>
										<ImageSlider images={item.images} height="h-16" width="w-16" />
									</TableCell>

									<TableCell className="text-xs text-muted-foreground">{item.id}</TableCell>

									<TableCell>
										<div>
											<p className="font-medium">{item.name}</p>
											{item.pieces?.length > 0 && (
												<div className="mt-1 flex gap-2 flex-wrap">
													{item.pieces.map((piece, idx) => (
														<div
															key={idx}
															className="flex items-center gap-1 text-xs text-muted-foreground"
														>
															<ImageSlider
																images={piece.images}
																height="h-6"
																width="w-6"
																rounded="rounded"
															/>

															<span>{piece.name}</span>
														</div>
													))}
												</div>
											)}
										</div>
									</TableCell>

									<TableCell className="text-sm">{item.category?.name || '—'}</TableCell>

									<TableCell className="capitalize text-sm">{item.currentStatus}</TableCell>

									<TableCell className="text-sm">{format(new Date(item.createdAt), 'P')}</TableCell>
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
