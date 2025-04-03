'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CREATE_ORDER } from '@/graphql/mutations/order';
import { useToast } from '@/hooks/use-toast';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { useMutation } from '@apollo/client';
import { X } from 'lucide-react';
import { useState } from 'react';

const AddClientOrderModal = ({ open, setOpen, selectedClient, selectedItems, setSelectedItems, refetch }) => {
	const { toast } = useToast();
	const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER);

	const [formData, setFormData] = useState({
		poNumber: '',
		itemNumber: '',
		status: 'pending',
		orderType: 'pending',
		deliveryAddress: '',
		warehouseAddress: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const items = selectedItems.map((item) => ({
			...item,
			images: []
		}));

		const input = {
			...formData,
			client: selectedClient.id,
			quantity: items.length,
			pieces: items
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
			setSelectedItems([]);
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
						<Label>Items Selected ({selectedItems.length})</Label>
						{selectedItems.length === 0 ? (
							<p className="text-muted-foreground text-sm mt-2">No items selected.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
								{selectedItems.map((item, index) => (
									<div
										key={item.id}
										className="relative flex items-start justify-between gap-4 border rounded-lg p-4 bg-muted/50 shadow-sm"
									>
										<div className="flex items-start gap-3">
											<div className="pt-1 text-muted-foreground">
												{getCategoryIcon(item.category)}
											</div>
											<div>
												<p className="font-semibold">{item.name}</p>
												<p className="text-xs text-muted-foreground">
													Category: {item.category?.name}
												</p>
												<Badge variant="outline" className="mt-1 text-[10px]">
													ID: {item.id.slice(-6)}
												</Badge>
											</div>
										</div>
										<Button
											type="button"
											size="icon"
											variant="ghost"
											className="text-muted-foreground hover:text-destructive"
											onClick={() => {
												const updated = [...selectedItems];
												updated.splice(index, 1);
												setSelectedItems(updated);
											}}
										>
											<X size={16} />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="col-span-2 flex justify-end gap-4 mt-6">
						<Button
							type="button"
							className="text-white"
							variant="secondary"
							onClick={() => setOpen(false)}
							disabled={creating}
						>
							Cancel
						</Button>
						<Button type="submit" variant="default" disabled={creating || selectedItems.length === 0}>
							{creating ? 'Creating...' : 'Create'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddClientOrderModal;
