'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CREATE_ORDER, UPDATE_ORDER } from '@/graphql/mutations/order';
import { GET_ME } from '@/graphql/queries/auth';
import { GET_CATEGORIES } from '@/graphql/queries/type';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const defaultFormDataDesigner = {
	description: '',
	quantity: 1,
	pieces: [],
	itemNumber: '',
	poNumber: '',
	status: 'pending',
	imagesByStatus: {
		pending: [],
		received: [],
		shipped: [],
		damaged: []
	},
	designer: '',
	client: '',
	category: ''
};

const AddClientOrderModal = ({ open, setOpen, order = null, refetch, selectedClient }) => {
	const isEditMode = !!order;
	const { toast } = useToast();
	const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER);
	const [updateOrder, { loading: updating }] = useMutation(UPDATE_ORDER);

	const { data: meData } = useQuery(GET_ME);
	const userId = meData?.me?.id;

	const { data: categoriesData } = useQuery(GET_CATEGORIES);

	const [formData, setFormData] = useState({ ...defaultFormDataDesigner });
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (order) {
			setFormData({
				...defaultFormDataDesigner,
				...order,
				imagesByStatus: order.imagesByStatus || {
					received: [],
					shipped: [],
					damaged: []
				}
			});
		} else if (userId && selectedClient?.id) {
			setFormData((prev) => ({
				...prev,
				designer: userId,
				client: selectedClient.id
			}));
		}
	}, [order, userId, selectedClient]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePieceChange = (index, field, value) => {
		const updatedPieces = [...formData.pieces];
		updatedPieces[index][field] = value;
		setFormData((prev) => ({ ...prev, pieces: updatedPieces }));
	};

	const addPiece = () => {
		setFormData((prev) => ({ ...prev, pieces: [...prev.pieces, { name: '', quantity: 1 }] }));
	};

	const removePiece = (index) => {
		const updatedPieces = formData.pieces.filter((_, i) => i !== index);
		setFormData((prev) => ({ ...prev, pieces: updatedPieces }));
	};

	const handleImageUpload = async (e, status) => {
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

		setFormData((prev) => ({
			...prev,
			imagesByStatus: {
				...prev.imagesByStatus,
				[status]: [...(prev.imagesByStatus?.[status] || []), ...readFilesAsBase64]
			}
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.client) newErrors.client = 'Client is required';
		if (!formData.category) newErrors.category = 'Category is required';
		if (!formData.quantity) newErrors.quantity = 'Quantity is required';
		return newErrors;
	};

	const sanitizeOrderInput = (data) => {
		const clone = { ...data };
		const fieldsToRemove = ['__typename', 'id', 'createdAt', 'updatedAt', 'receivedOn'];
		fieldsToRemove.forEach((field) => delete clone[field]);
		clone.pieces = (data.pieces || []).map((p) => ({ name: p.name, quantity: Number(p.quantity) }));
		return clone;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setErrors({});

		const cleanInput = sanitizeOrderInput(formData);

		try {
			if (isEditMode) {
				await updateOrder({ variables: { orderId: order.id, input: cleanInput } });
				toast({ title: '✅ Order updated successfully!' });
			} else {
				await createOrder({ variables: { ...cleanInput } });
				toast({ title: '✅ Order created successfully!' });
			}
			setOpen(false);
			refetch();
		} catch (error) {
			toast({ title: `❌ Error: ${error.message}` });
		}
	};

	const categories = categoriesData?.getTypes || [];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-10">
				<DialogHeader className={'my-3'}>
					<DialogTitle className="text-2xl font-semibold">
						{isEditMode ? 'Edit Order' : 'Create Order'}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
					{!isEditMode && (
						<>
							<div className="flex flex-col gap-2">
								<Label>Client</Label>
								<Input
									value={selectedClient?.name || ''}
									disabled
									className="bg-muted cursor-not-allowed"
								/>
								{errors.client && <p className="text-red-500 text-xs">{errors.client}</p>}
							</div>

							<div className="flex flex-col gap-2">
								<Label>Category</Label>
								<Select
									value={formData.category}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
								>
									<SelectTrigger className={errors.category ? 'border border-red-500' : ''}>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((type) => (
											<SelectItem key={type.id} value={type.id}>
												{type.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
							</div>
						</>
					)}

					{[
						{ label: 'Description', name: 'description' },
						{ label: 'Quantity', name: 'quantity', type: 'number' },
						{ label: 'Item Number', name: 'itemNumber' },
						{ label: 'PO Number', name: 'poNumber' }
					].map(({ label, name, type = 'text' }) => (
						<div key={name} className="flex flex-col gap-2">
							<Label>{label}</Label>
							<Input
								type={type}
								name={name}
								value={formData[name]}
								onChange={handleChange}
								className={errors[name] ? 'border border-red-500' : ''}
							/>
							{errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
						</div>
					))}

					<div className="col-span-2 mt-10">
						<Label>Images - {formData?.status}</Label>
						<Input
							className="mt-2"
							type="file"
							multiple
							onChange={(e) => handleImageUpload(e, 'pending')}
						/>
						<div className="flex gap-2 mt-2 flex-wrap">
							{formData.imagesByStatus?.pending?.map((src, index) => (
								<img
									key={index}
									src={src}
									alt={`received-${index}`}
									className="w-20 h-20 object-cover rounded border"
								/>
							))}
						</div>
					</div>

					<div className="col-span-2 flex flex-col gap-2">
						<Label>Pieces</Label>
						{formData.pieces.map((piece, index) => (
							<div key={index} className="flex items-center gap-2 mb-2">
								<Input
									placeholder="Name"
									value={piece.name}
									onChange={(e) => handlePieceChange(index, 'name', e.target.value)}
									className="w-1/2"
								/>
								<Input
									type="number"
									placeholder="Qty"
									value={piece.quantity}
									onChange={(e) => handlePieceChange(index, 'quantity', e.target.value)}
									className="w-1/3"
								/>
								<Button
									type="button"
									variant="ghost"
									className="text-red-600 px-2"
									onClick={() => removePiece(index)}
								>
									✕
								</Button>
							</div>
						))}
						<Button type="button" variant="link" onClick={addPiece} className="text-blue-600 text-sm mt-1">
							+ Add Piece
						</Button>
					</div>

					<div className="col-span-2 flex justify-end gap-4 mt-6">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setOpen(false)}
							disabled={creating || updating}
						>
							Cancel
						</Button>
						<Button type="submit" variant="default" disabled={creating || updating}>
							{creating || updating
								? isEditMode
									? 'Updating...'
									: 'Creating...'
								: isEditMode
								? 'Update'
								: 'Create'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddClientOrderModal;
