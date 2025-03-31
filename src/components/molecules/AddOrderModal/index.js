'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CREATE_ORDER, UPDATE_ORDER } from '@/graphql/mutations/order';
import { GET_CATEGORIES } from '@/graphql/queries/type';
import { GET_CLIENTS_BY_DESIGNER, GET_USERS } from '@/graphql/queries/user';
import { useToast } from '@/hooks/use-toast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const defaultFormData = {
	description: '',
	quantity: 1,
	pieces: [],
	carrier: '',
	shipper: '',
	itemNumber: '',
	poNumber: '',
	status: 'pending',
	orderType: 'pending',
	deliveryAddress: '',
	warehouseAddress: ''
};

const AddOrderModal = ({ open, setOpen, order = null, refetch }) => {
	const isEditMode = !!order;
	const { toast } = useToast();
	const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER);
	const [updateOrder, { loading: updating }] = useMutation(UPDATE_ORDER);

	const { data: userData } = useQuery(GET_USERS);
	const { data: categoriesData } = useQuery(GET_CATEGORIES);
	const [fetchClients, { data: clientsData, loading: clientsLoading }] = useLazyQuery(GET_CLIENTS_BY_DESIGNER);

	const [selectedDesigner, setSelectedDesigner] = useState('');
	const [formData, setFormData] = useState({ ...defaultFormData });
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (selectedDesigner) {
			fetchClients({ variables: { designerId: selectedDesigner } });
		}
	}, [selectedDesigner]);

	useEffect(() => {
		if (order) {
			setFormData({
				...defaultFormData,
				...order,
				imagesByStatus: order.imagesByStatus || {
					received: [],
					shipped: [],
					damaged: []
				}
			});
		} else {
			setFormData({ ...defaultFormData });
		}
	}, [order]);

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
					reader.readAsDataURL(file); // ✅ convierte a base64
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

		if (!formData.designer) newErrors.designer = 'Designer is required';
		if (!formData.client) newErrors.client = 'Client is required';
		if (!formData.category) newErrors.category = 'Category is required';
		if (!formData.quantity) newErrors.quantity = 'Quantity is required';
		if (!formData.orderType) newErrors.orderType = 'Order type is required';

		if (formData.orderType === 'delivery' && !formData.deliveryAddress) {
			newErrors.deliveryAddress = 'Delivery address is required';
		}
		if (formData.orderType === 'warehouse' && !formData.warehouseAddress) {
			newErrors.warehouseAddress = 'Warehouse address is required';
		}

		return newErrors;
	};

	const sanitizeOrderInput = (data) => {
		const clone = { ...data };
		const fieldsToRemove = ['__typename', 'id', 'createdAt', 'updatedAt', 'receivedOn'];

		fieldsToRemove.forEach((field) => delete clone[field]);

		// Asegura que estos campos sean solo IDs
		clone.designer = data.designer?.id || data.designer;
		clone.client = data.client?.id || data.client;
		clone.category = data.category?.id || data.category;

		// Sanitiza pieces
		clone.pieces = (data.pieces || []).map((p) => ({
			name: p.name,
			quantity: Number(p.quantity)
		}));

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

		try {
			const cleanInput = sanitizeOrderInput(formData);

			if (isEditMode) {
				await updateOrder({ variables: { orderId: order.id, input: cleanInput } });
				toast({ title: '✅ Order updated successfully!' });
			} else {
				await createOrder({ variables: { ...cleanInput } });
				toast({ title: '✅ Order created successfully!' });
			}
			handleCancel();
			refetch();
		} catch (error) {
			toast({ title: `❌ Error: ${error.message}` });
		}
	};

	const handleCancel = () => {
		setOpen(false);
		setFormData({ ...defaultFormData });
		setErrors({});
	};

	const clients = clientsData?.getClientsByDesigner || [];
	const designers = userData?.getUsers?.filter((u) => u.role === 'designer' || u.role === 'client') || [];
	const carriers = userData?.getUsers?.filter((u) => u.role === 'carrier') || [];
	const shippers = userData?.getUsers?.filter((u) => u.role === 'shipper') || [];
	const categories = categoriesData?.getTypes || [];

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
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
								<Label>Designer</Label>
								<Select
									value={formData.designer}
									onValueChange={(value) => {
										setFormData((prev) => ({ ...prev, designer: value }));
										setSelectedDesigner(value);
									}}
								>
									<SelectTrigger className={errors.designer ? 'border border-red-500' : ''}>
										<SelectValue placeholder="Select designer" />
									</SelectTrigger>
									<SelectContent>
										{designers.map((designer) => (
											<SelectItem key={designer.id} value={designer.id}>
												{designer.name}
												{designer.organizations?.length > 0 && (
													<span className="ml-2 text-xs text-muted-foreground">
														({designer.organizations[0]?.name})
													</span>
												)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.designer && <p className="text-red-500 text-xs">{errors.designer}</p>}
							</div>

							<div className="flex flex-col gap-2">
								<Label>Client</Label>
								<Select
									value={formData.client}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, client: value }))}
								>
									<SelectTrigger className={errors.client ? 'border border-red-500' : ''}>
										<SelectValue
											placeholder={clientsLoading ? 'Loading clients...' : 'Select client'}
										/>
									</SelectTrigger>
									<SelectContent>
										{clientsLoading ? (
											<SelectItem disabled value="loading">
												Loading clients...
											</SelectItem>
										) : clients.length > 0 ? (
											clients.map((client) => (
												<SelectItem key={client.id} value={client.id}>
													{client.name}
												</SelectItem>
											))
										) : (
											<SelectItem disabled value="none">
												No clients found
											</SelectItem>
										)}
									</SelectContent>
								</Select>
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
										{categories?.map((type) => (
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

					{/* Carrier */}
					<div className="flex flex-col gap-2">
						<Label>Carrier</Label>
						<Select
							name="carrier"
							value={formData.carrier}
							onValueChange={(value) => setFormData((prev) => ({ ...prev, carrier: value }))}
						>
							<SelectTrigger className={errors.carrier ? 'border border-red-500' : ''}>
								<SelectValue placeholder="Select carrier" />
							</SelectTrigger>
							<SelectContent>
								{carriers.map((carrier) => (
									<SelectItem key={carrier.id} value={carrier.id}>
										{carrier.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Shipper */}
					<div className="flex flex-col gap-2">
						<Label>Shipper</Label>
						<Select
							name="shipper"
							value={formData.shipper}
							onValueChange={(value) => setFormData((prev) => ({ ...prev, shipper: value }))}
						>
							<SelectTrigger className={errors.shipper ? 'border border-red-500' : ''}>
								<SelectValue placeholder="Select shipper" />
							</SelectTrigger>
							<SelectContent>
								{shippers.map((shipper) => (
									<SelectItem key={shipper.id} value={shipper.id}>
										{shipper.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Status</Label>
						<Select
							name="status"
							value={formData.status}
							onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="received">Received</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
								<SelectItem value="damaged">Damaged</SelectItem>
							</SelectContent>
						</Select>
					</div>

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

					<div className="flex flex-col gap-2">
						<Label>Order Type</Label>
						<Select
							name="orderType"
							value={formData.orderType}
							onValueChange={(value) => setFormData((prev) => ({ ...prev, orderType: value }))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="warehouse">Warehouse</SelectItem>
								<SelectItem value="delivery">Delivery</SelectItem>
							</SelectContent>
							{errors.orderType && <p className="text-red-500 text-xs">{errors.orderType}</p>}
						</Select>
					</div>

					{formData?.orderType === 'delivery' && (
						<div className="col-span-2 flex flex-col gap-2">
							<Label>Delivery Address</Label>
							<Input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} />
						</div>
					)}
					{formData?.orderType === 'warehouse' && (
						<div className="col-span-2 flex flex-col gap-2">
							<Label>Warehouse Address</Label>
							<Input name="warehouseAddress" value={formData.warehouseAddress} onChange={handleChange} />
						</div>
					)}

					{/* Image uploads by status */}
					<div className="col-span-2 mt-10">
						{['received'].map((status) => (
							<div key={status} className="col-span-2 flex flex-col gap-2">
								<Label>{`Images - Order`}</Label>
								<Input type="file" multiple onChange={(e) => handleImageUpload(e, status)} />
								<div className="flex gap-2 mt-2 flex-wrap">
									{formData.imagesByStatus?.[status]?.map((src, index) => (
										<img
											key={index}
											src={src}
											alt={`${status}-${index}`}
											className="w-20 h-20 object-cover rounded border"
										/>
									))}
								</div>
							</div>
						))}
					</div>

					{formData.status === 'damaged' && (
						<div className="col-span-2 flex flex-col gap-2 mt-4">
							<Label>Images - Damaged</Label>
							<Input type="file" multiple onChange={(e) => handleImageUpload(e, 'damaged')} />
							<div className="flex gap-2 mt-2 flex-wrap">
								{formData.imagesByStatus?.damaged?.map((src, index) => (
									<img
										key={index}
										src={src}
										alt={`damaged-${index}`}
										className="w-20 h-20 object-cover rounded border"
									/>
								))}
							</div>
						</div>
					)}

					<div className="col-span-2 flex flex-col gap-2">
						<Label>Pieces</Label>
						{formData.pieces &&
							formData.pieces.map((piece, index) => (
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

					{isEditMode && (
						<div className="col-span-2 text-xs text-muted-foreground mt-4">
							<p>
								<strong>Received On:</strong>{' '}
								{/* {formData.receivedOn ? format(new Date(formData.receivedOn), 'PPP') : 'N/A'} */}
							</p>
							<p>
								<strong>Created At:</strong>{' '}
								{/* {formData.createdAt ? format(new Date(formData.createdAt), 'PPP') : 'N/A'} */}
							</p>
						</div>
					)}

					<div className="col-span-2 flex justify-end gap-4 mt-6">
						<Button
							type="button"
							variant="secondary"
							onClick={() => handleCancel()}
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

export default AddOrderModal;
