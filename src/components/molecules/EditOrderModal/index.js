'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UPDATE_ORDER_AND_INVENTORY } from '@/graphql/mutations/order';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import InventoryPieceForm from '../AddInventoryItemModal/components/InventoryPieceForm';

const EditOrderModal = ({ open, setOpen, order, refetch }) => {
	const { toast } = useToast();
	const [items, setItems] = useState([]);
	const [formData, setFormData] = useState({
		poNumber: '',
		itemNumber: '',
		description: '',
		carrier: '',
		shipper: ''
	});
	const [updateOrderAndInventory, { loading }] = useMutation(UPDATE_ORDER_AND_INVENTORY);

	useEffect(() => {
		if (order?.items) {
			const normalized = order.items.map((item) => ({
				...item,
				status: item.currentStatus || 'received',
				location: item.location || '',
				imagesByStatus: { ...(item.imagesByStatus || {}) },
				pieces: (item.pieces || []).map((p) => ({
					...p,
					note: p.note || '',
					location: p.location || '',
					status: p.status || 'received',
					imagesByStatus: { ...(p.imagesByStatus || {}) }
				}))
			}));
			setItems(normalized);
		}
		if (order) {
			setFormData({
				poNumber: order.poNumber || '',
				itemNumber: order.itemNumber || '',
				description: order.description || '',
				carrier: order.carrier || '',
				shipper: order.shipper || ''
			});
		}
	}, [order]);

	const handleSubmit = async () => {
		try {
			const input = {
				status: order.status,
				note: 'Updated by admin',
				...formData,
				items: items.map((item) => ({
					id: item.id,
					currentStatus: item.currentStatus,
					imagesByStatus: item.imagesByStatus,
					pieces: item.pieces.map((piece) => ({
						name: piece.name,
						status: piece.status,
						note: piece.note,
						location: piece.location,
						imagesByStatus: piece.imagesByStatus
					}))
				}))
			};

			await updateOrderAndInventory({ variables: { orderId: order.id, input } });
			toast({ title: '✅ Order updated successfully' });
			setOpen(false);
			refetch?.();
		} catch (err) {
			toast({
				title: '❌ Error updating order',
				description: err.message,
				variant: 'destructive'
			});
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-10">
				<DialogHeader>
					<DialogTitle>Edit Order: #{order?.id?.slice(-6)}</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-4 my-6">
					<div>
						<Label>PO Number</Label>
						<Input name="poNumber" value={formData.poNumber} onChange={handleInputChange} />
					</div>
					<div>
						<Label>Item Number</Label>
						<Input name="itemNumber" value={formData.itemNumber} onChange={handleInputChange} />
					</div>
					<div>
						<Label>Carrier</Label>
						<Input name="carrier" value={formData.carrier} onChange={handleInputChange} />
					</div>
					<div>
						<Label>Shipper</Label>
						<Input name="shipper" value={formData.shipper} onChange={handleInputChange} />
					</div>
					<div className="col-span-2">
						<Label>Description</Label>
						<Textarea name="description" value={formData.description} onChange={handleInputChange} />
					</div>
				</div>

				<InventoryPieceForm pieces={items} setPieces={setItems} />

				<div className="flex justify-end mt-6">
					<Button onClick={handleSubmit} disabled={loading}>
						{loading ? 'Saving...' : 'Save Changes'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditOrderModal;
