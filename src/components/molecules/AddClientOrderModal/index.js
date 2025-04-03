'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CREATE_ORDER } from '@/graphql/mutations/order';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

const AddClientOrderModal = ({ open, setOpen, selectedClient, selectedItems, setSelectedItems, refetch }) => {
	const { toast } = useToast();
	const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER);
	const [imagesByItem, setImagesByItem] = useState({});

	const [formData, setFormData] = useState({
		poNumber: '',
		itemNumber: '',
		status: 'pending',
		orderType: 'pending',
		deliveryAddress: '',
		warehouseAddress: ''
	});

	const handleImageUpload = async (e, itemId) => {
		const files = Array.from(e.target.files);

		const readFilesAsBase64 = await Promise.all(
			files.map((file) => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
			})
		);

		setImagesByItem((prev) => ({
			...prev,
			[itemId]: [...(prev[itemId] || []), ...readFilesAsBase64]
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const items = selectedItems.map((item) => ({
			...item,
			images: imagesByItem[item.id] || []
		}));

		const input = {
			...formData,
			client: selectedClient.id,
			quantity: items.length,
			pieces: items // reutilizamos "pieces" para almacenar los items con imagenes
		};

		try {
			await createOrder({ variables: { input } });
			toast({ title: '✅ Order created successfully!' });
			setOpen(false);
			setFormData({
				poNumber: '',
				itemNumber: '',
				status: 'pending',
				orderType: 'pending',
				deliveryAddress: '',
				warehouseAddress: ''
			});
			setImagesByItem({});
			refetch && refetch();
		} catch (error) {
			toast({ title: `❌ Error: ${error.message}` });
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-10">
				<DialogHeader className={'my-3'}>
					<DialogTitle className="text-2xl font-semibold">Create Order</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex flex-col gap-2">
						<Label>PO Number</Label>
						<Input name="poNumber" value={formData.poNumber} onChange={handleChange} />
					</div>

					<div className="flex flex-col gap-2">
						<Label>Item Number</Label>
						<Input name="itemNumber" value={formData.itemNumber} onChange={handleChange} />
					</div>

					{formData.orderType === 'delivery' && (
						<div className="col-span-2 flex flex-col gap-2">
							<Label>Delivery Address</Label>
							<Input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} />
						</div>
					)}
					{formData.orderType === 'warehouse' && (
						<div className="col-span-2 flex flex-col gap-2">
							<Label>Warehouse Address</Label>
							<Input name="warehouseAddress" value={formData.warehouseAddress} onChange={handleChange} />
						</div>
					)}

					<div className="col-span-2">
						<Label>Items</Label>
						<div className="grid grid-cols-2 gap-4 mt-2">
							{selectedItems.map((item) => (
								<div key={item.id} className="border p-3 rounded shadow-sm">
									<p className="font-medium mb-1">{item.name}</p>
									<p className="text-xs text-muted-foreground mb-2">
										Category: {item.category?.name}
									</p>
									<Input type="file" multiple onChange={(e) => handleImageUpload(e, item.id)} />
									<div className="flex gap-2 mt-2 flex-wrap">
										{(imagesByItem[item.id] || []).map((src, index) => (
											<img
												key={index}
												src={src}
												alt={`item-${index}`}
												className="w-16 h-16 object-cover rounded border"
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="col-span-2 flex justify-end gap-4 mt-6">
						<Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={creating}>
							Cancel
						</Button>
						<Button type="submit" variant="default" disabled={creating}>
							{creating ? 'Creating...' : 'Create'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddClientOrderModal;
