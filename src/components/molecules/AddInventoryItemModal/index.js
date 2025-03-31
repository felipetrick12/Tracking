import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UPDATE_INVENTORY_ITEM } from '@/graphql/queries/inventory';
import { GET_ORDER_IMAGES } from '@/graphql/queries/order';
import { useToast } from '@/hooks/use-toast';
import { useLazyQuery, useMutation } from '@apollo/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const AddInventoryItemModal = ({ open, setOpen, item, refetchInventory }) => {
	const { toast } = useToast();
	const [updateInventoryItem, { loading: updating }] = useMutation(UPDATE_INVENTORY_ITEM);
	const [formData, setFormData] = useState({
		location: item?.location || '',
		status: item?.status || 'stored',
		image: item?.image || ''
	});

	const { data: orderData, loading: orderLoading } = useLazyQuery(GET_ORDER_IMAGES, {
		variables: { orderId: item?.order?.id },
		skip: !item?.order
	});

	const [selectedImage, setSelectedImage] = useState('');
	const [orderImages, setOrderImages] = useState([]);

	useEffect(() => {
		if (item) {
			setFormData({
				location: item.location || '', // Si item.location es null, usa ''
				status: item.status || 'stored', // Si item.status es null, usa 'stored'
				image: item.image || '' // Si item.image es null, usa ''
			});
		} else {
			setFormData({
				location: '',
				status: 'stored',
				image: ''
			});
		}
	}, [item]);

	useEffect(() => {
		if (orderData?.getOrderById) {
			const images = [];
			for (const status in orderData.getOrderById.imagesByStatus) {
				if (orderData.getOrderById.imagesByStatus[status]) {
					orderData.getOrderById.imagesByStatus[status].forEach((url) => {
						images.push({ url, status });
					});
				}
			}
			setOrderImages(images);
		}
	}, [orderData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageSelect = (imageUrl) => {
		setSelectedImage(imageUrl);
		setFormData((prev) => ({ ...prev, image: imageUrl }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateInventoryItem({
				variables: {
					id: item._id,
					input: {
						location: formData.location,
						status: formData.status,
						image: formData.image
					}
				}
			});
			toast({ title: '✅ Inventory item updated successfully!' });
			setOpen(false);
			refetchInventory();
		} catch (error) {
			toast({ title: `❌ Error: ${error.message}` });
		}
	};

	const handleCancel = () => {
		setOpen(false);
		setFormData({ location: item?.location || '', status: item?.status || 'stored', image: item?.image || '' });
		setSelectedImage('');
	};

	const inventoryStatuses = ['stored', 'damaged', 'shipped', 'assigned'];

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-auto p-6">
				<DialogHeader className={'my-3'}>
					<DialogTitle className="text-2xl font-semibold">Edit Inventory Item</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex flex-col gap-2">
						<Label>Location</Label>
						<Input name="location" value={formData.location} onChange={handleChange} />
					</div>
					<div className="flex flex-col gap-2">
						<Label>Status</Label>
						<Select
							value={formData.status}
							onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								{inventoryStatuses.map((status) => (
									<SelectItem key={status} value={status}>
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Image</Label>
						<Input
							name="image"
							value={formData.image}
							onChange={handleChange}
							placeholder="Enter image URL"
						/>
						{formData.image && (
							<div className="mt-2">
								<Image
									src={formData.image}
									alt="Selected"
									width={100}
									height={100}
									className="rounded border"
								/>
							</div>
						)}
					</div>
					{/* Image Selection from Order */}
					{!orderLoading && orderImages.length > 0 && (
						<div className="flex flex-col gap-2">
							<Label>Choose from Order Images</Label>
							<div className="flex flex-wrap gap-2">
								{orderImages.map((img, index) => (
									<div
										key={index}
										onClick={() => handleImageSelect(img.url)}
										className={`relative cursor-pointer rounded border-2 ${
											selectedImage === img.url ? 'border-blue-500' : 'border-transparent'
										}`}
									>
										<Image
											src={img.url}
											alt={`Order ${img.status} ${index}`}
											width={80}
											height={80}
											className="rounded object-cover"
										/>
										<span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center rounded-b">
											{img.status}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-end gap-4 mt-6">
						<Button type="button" variant="secondary" onClick={handleCancel} disabled={updating}>
							Cancel
						</Button>
						<Button type="submit" variant="default" disabled={updating}>
							{updating ? 'Updating...' : 'Update'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddInventoryItemModal;
