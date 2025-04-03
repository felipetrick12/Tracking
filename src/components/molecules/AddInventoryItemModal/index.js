'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CREATE_MULTIPLE_INVENTORY_ITEMS } from '@/graphql/mutations/inventory';
import { GET_CATEGORIES } from '@/graphql/queries/type';
import { GET_CLIENTS_BY_DESIGNER, GET_USERS } from '@/graphql/queries/user';
import { useToast } from '@/hooks/use-toast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const AddInventoryItemModal = ({ open, setOpen, orders = [], refetch }) => {
	const toast = useToast();

	const { data: userData } = useQuery(GET_USERS);
	const [createItems, { loading }] = useMutation(CREATE_MULTIPLE_INVENTORY_ITEMS);
	const [fetchClients, { data: clientsData, loading: clientsLoading }] = useLazyQuery(GET_CLIENTS_BY_DESIGNER);
	const { data: categoriesData } = useQuery(GET_CATEGORIES);

	const [selectedDesigner, setSelectedDesigner] = useState('');
	const [pieces, setPieces] = useState([]);
	const [formData, setFormData] = useState({
		name: '',
		quantity: 1,
		category: '',
		client: '',
		designer: '',
		location: '',
		images: [],
		pieces: []
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (selectedDesigner) {
			fetchClients({ variables: { designerId: selectedDesigner } });
		}
	}, [selectedDesigner]);

	useEffect(() => {
		if (formData.quantity && Number(formData.quantity) > 0) {
			const qty = Number(formData.quantity);
			setPieces((prevItems) => {
				let newItems = [...prevItems];

				// Actualizar nombres para todos los ítems existentes
				newItems = newItems.map((item, index) => ({
					...item,
					name: `${formData.name || 'Item'} ${index + 1}`
				}));

				// Agregar nuevos si hacen falta
				while (newItems.length < qty) {
					newItems.push({
						name: `${formData.name || 'Item'} ${newItems.length + 1}`,
						images: [],
						pieces: []
					});
				}

				// Cortar si hay demasiados
				if (newItems.length > qty) {
					return newItems.slice(0, qty);
				}

				return newItems;
			});
		}
	}, [formData.quantity, formData.name]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const handleSelectChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = 'Name is required';
		if (!formData.quantity || Number(formData.quantity) < 1) newErrors.quantity = 'Quantity must be at least 1';
		if (!formData.category) newErrors.category = 'Category is required';
		if (!formData.designer) newErrors.designer = 'Designer is required';
		if (!formData.client) newErrors.client = 'Client is required';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			toast.toast({
				title: '❌ Validation error',
				description: 'Please fix the errors in the form.',
				variant: 'destructive'
			});
			return;
		}
		try {
			const payload = {
				...formData,
				quantity: Number(formData.quantity),
				images: pieces.flatMap((p) => p.images || []), // solo si quieres mandar TODAS como del item (opcional)
				pieces: pieces.map((p) => ({
					name: p.name,
					description: '', // opcional si no está en ese nivel
					images: p.images || []
				}))
			};

			console.log('first payload', payload);

			await createItems({
				variables: { input: payload }
			});
			toast.toast({ title: '✅ Inventory pieces created successfully!' });
			setOpen(false);
			refetch && refetch();
		} catch (error) {
			console.error('Error creating inventory pieces:', error);
			toast.toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
		}
	};

	const handlePieceChange = (itemIndex, pieceIndex, field, value) => {
		const updatedItems = [...pieces];
		updatedItems[itemIndex].pieces[pieceIndex][field] = value;
		setPieces(updatedItems);
	};

	const handleItemImageChange = async (index, file) => {
		try {
			const imageUrl = URL.createObjectURL(file);
			const updatedItems = [...pieces];
			updatedItems[index].images = [...(updatedItems[index].images || []), imageUrl];
			setPieces(updatedItems);
		} catch (error) {
			console.error('Error converting image to base64:', error);
		}
	};

	const handlePieceImageChange = async (itemIndex, pieceIndex, file) => {
		try {
			const imageUrl = URL.createObjectURL(file);
			const updatedItems = [...pieces];
			if (!updatedItems[itemIndex].pieces[pieceIndex].images) {
				updatedItems[itemIndex].pieces[pieceIndex].images = [];
			}
			updatedItems[itemIndex].pieces[pieceIndex].images = [imageUrl];
			setPieces(updatedItems);
		} catch (error) {
			console.error('Error converting image to base64:', error);
		}
	};

	const addPiece = (itemIndex) => {
		const updatedItems = [...pieces];
		if (!updatedItems[itemIndex].pieces) updatedItems[itemIndex].pieces = [];
		updatedItems[itemIndex].pieces.push({ name: '', description: '', images: [] });
		setPieces(updatedItems);
	};

	const categories = categoriesData?.getTypes || [];
	const designers = userData?.getUsers?.filter((u) => u.role === 'designer' || u.role === 'client') || [];
	const clients = clientsData?.getClientsByDesigner || [];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-auto p-6">
				<DialogHeader className="my-3">
					<DialogTitle className="text-2xl font-semibold">Register Inventory Items</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Name</Label>
							<Input name="name" value={formData.name} onChange={handleChange} />
							{errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
						</div>
						<div>
							<Label>Quantity</Label>
							<Input
								type="number"
								name="quantity"
								value={formData.quantity}
								onChange={handleChange}
								min={1}
							/>
							{errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
						</div>
					</div>

					<div>
						<Label>Category</Label>
						<Select onValueChange={(value) => handleSelectChange('category', value)}>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
					</div>

					<div>
						<Label>Designer</Label>
						<Select
							onValueChange={(value) => {
								handleSelectChange('designer', value);
								setSelectedDesigner(value);
							}}
						>
							<SelectTrigger>
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
						{errors.designer && <p className="text-sm text-red-500 mt-1">{errors.designer}</p>}
					</div>

					<div>
						<Label>Client</Label>
						<Select onValueChange={(value) => handleSelectChange('client', value)}>
							<SelectTrigger>
								<SelectValue placeholder="Select client" />
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
						{errors.client && <p className="text-sm text-red-500 mt-1">{errors.client}</p>}
					</div>

					<div>
						<Label>Location</Label>
						<Input name="location" value={formData.location} onChange={handleChange} />
					</div>

					{pieces.length > 0 && (
						<div className="mt-6 space-y-4">
							<h3 className="text-lg font-semibold">Items Preview ({pieces.length})</h3>
							<div className="grid grid-cols-2 gap-4">
								{pieces.map((item, index) => (
									<div key={item.itemNumber} className="rounded-lg border bg-muted/30 p-4">
										<p className="font-semibold">{item.name}</p>

										<Input
											type="file"
											accept="image/*"
											onChange={(e) => handleItemImageChange(index, e.target.files[0])}
											className="mt-2"
										/>
										{item.images?.map((img, i) => (
											<img
												key={i}
												src={img}
												alt="Item preview"
												className="mt-2 h-24 w-auto object-cover rounded-md"
											/>
										))}
										<div className="mt-2">
											{item.pieces.map((piece, pIndex) => (
												<div key={pIndex} className="border p-2 mt-2 rounded-md">
													<Input
														type="text"
														placeholder="Piece Name"
														value={piece.name}
														onChange={(e) =>
															handlePieceChange(index, pIndex, 'name', e.target.value)
														}
													/>
													<Input
														type="text"
														placeholder="Description"
														value={piece.description}
														onChange={(e) =>
															handlePieceChange(
																index,
																pIndex,
																'description',
																e.target.value
															)
														}
														className="mt-2"
													/>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) =>
															handlePieceImageChange(index, pIndex, e.target.files[0])
														}
														className="mt-2"
													/>
													{piece.images?.[0] && (
														<img
															src={piece.images[0]}
															alt="Piece preview"
															className="mt-2 h-20 w-auto object-cover rounded-md"
														/>
													)}
												</div>
											))}
											<Button type="button" onClick={() => addPiece(index)} className="mt-2">
												+ Add Piece
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-end">
						<Button type="submit" disabled={loading}>
							{loading ? 'Registering...' : 'Register Items'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddInventoryItemModal;
