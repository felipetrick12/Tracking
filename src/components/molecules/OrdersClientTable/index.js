'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_ORDERS } from '@/graphql/queries/order';
import { getStatusRowClass } from '@/utils/getStatusRowClass';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { Ban } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const STATUS_OPTIONS = ['pending', 'received', 'shipped', 'delivered', 'damaged'];

const normalizeMap = (maybeMap) => {
	if (maybeMap instanceof Map) return Object.fromEntries(maybeMap.entries());
	if (typeof maybeMap === 'object' && maybeMap !== null) return maybeMap;
	return {};
};

const OrdersClientTable = ({ designerID }) => {
	const { data, loading, error } = useQuery(GET_ORDERS, {
		variables: { designerId: designerID }
	});

	const [expandedRow, setExpandedRow] = useState(null);
	const [itemStatuses, setItemStatuses] = useState({});

	const toggleRow = (orderId) => {
		setExpandedRow((prev) => (prev === orderId ? null : orderId));
	};

	const handleItemStatusChange = (itemId, status) => {
		setItemStatuses((prev) => ({
			...prev,
			[itemId]: status
		}));
	};

	if (loading) return <p className="text-sm text-muted-foreground">Loading orders...</p>;
	if (error) return <p className="text-sm text-red-500">Error loading orders</p>;

	const orders = data?.getOrders || [];

	console.log('ORDERS', orders);

	return (
		<Card className="p-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Client</TableHead>
						<TableHead>Items</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Accepted</TableHead>
						<TableHead>Shipped</TableHead>
						<TableHead>Delivered</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<React.Fragment key={order.id}>
							<TableRow className={`transition hover:bg-muted ${getStatusRowClass(order.status)}`}>
								<TableCell className="font-mono text-xs">{order.id.slice(-6)}</TableCell>
								<TableCell>{order.client?.name}</TableCell>
								<TableCell>{order.items.length}</TableCell>
								<TableCell>
									{order.createdAt && (
										<span className="text-sm text-muted-foreground">
											{format(new Date(order.createdAt), 'Pp')}
										</span>
									)}
								</TableCell>
								<TableCell>
									{order.acceptedAt ? (
										<span className="text-sm text-muted-foreground">
											{format(new Date(order.acceptedAt), 'Pp')}
										</span>
									) : (
										<span className="text-sm text-muted-foreground italic">—</span>
									)}
								</TableCell>
								<TableCell>
									{order.shippedAt ? (
										<span className="text-sm text-muted-foreground">
											{format(new Date(order.shippedAt), 'Pp')}
										</span>
									) : (
										<span className="text-sm text-muted-foreground italic">—</span>
									)}
								</TableCell>
								<TableCell>
									{order.deliveredAt ? (
										<span className="text-sm text-muted-foreground">
											{format(new Date(order.deliveredAt), 'Pp')}
										</span>
									) : (
										<span className="text-sm text-muted-foreground italic">—</span>
									)}
								</TableCell>
								<TableCell>
									<button
										className="text-sm text-blue-600 underline"
										onClick={() => toggleRow(order.id)}
									>
										{expandedRow === order.id ? 'Hide' : 'View'}
									</button>
								</TableCell>
							</TableRow>

							{expandedRow === order.id && (
								<TableRow>
									<TableCell colSpan={4} className="bg-muted/40">
										<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
											{order.items.map((item) => {
												const selectedStatus =
													itemStatuses[item.id] || item.currentStatus || order.status;

												const normalizedImages = normalizeMap(item.imagesByStatus);
												const imageUrl = normalizedImages[selectedStatus]?.[0];

												return (
													<div
														key={item.id}
														className="border rounded p-4 bg-white flex flex-col gap-4"
													>
														<div className="w-full h-40 relative">
															{imageUrl ? (
																<Image
																	src={imageUrl}
																	alt="item"
																	fill
																	className="object-cover rounded border"
																	loading="lazy"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center text-muted-foreground border rounded">
																	<Ban className="w-6 h-6" />
																	<span className="ml-2 text-xs">No image</span>
																</div>
															)}
														</div>

														<div className="flex-1">
															<p className="font-semibold">{item.name}</p>
															<p className="text-sm text-muted-foreground">
																QR: {item.qrCode} | Location: {item.location}
															</p>
															<Badge variant="outline" className="mt-1 text-[10px]">
																Current: {item.currentStatus}
															</Badge>
														</div>

														<Select
															value={selectedStatus}
															onValueChange={(value) =>
																handleItemStatusChange(item.id, value)
															}
														>
															<SelectTrigger>
																<SelectValue placeholder="Status" />
															</SelectTrigger>
															<SelectContent>
																{STATUS_OPTIONS.map((status) => (
																	<SelectItem key={status} value={status}>
																		{status}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>

														{item.pieces?.length > 0 && (
															<div className="mt-4">
																<p className="font-medium text-sm mb-2">Pieces:</p>
																<div className="grid grid-cols-1 gap-2">
																	{item.pieces.map((piece, i) => {
																		const normalizedPieceImages = normalizeMap(
																			piece.imagesByStatus
																		);
																		const pieceImage =
																			normalizedPieceImages[selectedStatus]?.[0];

																		return (
																			<div key={i} className="border rounded p-3">
																				<p className="font-medium text-sm">
																					{piece.name}
																				</p>
																				<p className="text-xs text-muted-foreground mb-1">
																					Status: {piece.status}
																				</p>
																				<div className="w-full aspect-square min-h-[120px] relative">
																					{pieceImage ? (
																						<Image
																							src={pieceImage}
																							alt="piece"
																							fill
																							className="object-cover rounded border"
																							loading="lazy"
																						/>
																					) : (
																						<div className="w-full h-full flex items-center justify-center text-muted-foreground border rounded">
																							<Ban className="w-5 h-5" />
																							<span className="ml-2 text-xs">
																								No image
																							</span>
																						</div>
																					)}
																				</div>
																			</div>
																		);
																	})}
																</div>
															</div>
														)}
													</div>
												);
											})}
										</div>
									</TableCell>
								</TableRow>
							)}
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</Card>
	);
};

export default OrdersClientTable;
