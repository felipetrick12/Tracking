'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CREATE_MULTIPLE_INVENTORY_ITEMS, UPDATE_INVENTORY_ITEM } from '@/graphql/mutations/inventory';
import { GET_CATEGORIES } from '@/graphql/queries/type';
import { GET_CLIENTS_BY_DESIGNER, GET_USERS } from '@/graphql/queries/user';
import { useToast } from '@/hooks/use-toast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import InventoryForm from './components/InventoryForm';
import InventoryPieceForm from './components/InventoryPieceForm';

const AddInventoryItemModal = ({ open, setOpen, item, refetch }) => {
	const toast = useToast();

	const { data: userData } = useQuery(GET_USERS);
	const { data: categoriesData } = useQuery(GET_CATEGORIES);
	const [fetchClients, { data: clientsData, loading: clientsLoading }] = useLazyQuery(GET_CLIENTS_BY_DESIGNER);
	const [createItems, { loading: creating }] = useMutation(CREATE_MULTIPLE_INVENTORY_ITEMS);
	const [updateItem, { loading: updating }] = useMutation(UPDATE_INVENTORY_ITEM);

	const [formData, setFormData] = useState({
		name: '',
		quantity: 1,
		category: '',
		designer: '',
		client: '',
		location: '',
		pieces: []
	});

	const [selectedDesigner, setSelectedDesigner] = useState('');
	const [errors, setErrors] = useState({});
	const [pieces, setPieces] = useState([]);

	useEffect(() => {
		if (selectedDesigner) {
			fetchClients({ variables: { designerId: selectedDesigner } });
		}
	}, [selectedDesigner]);

	useEffect(() => {
		if (item) {
			const itemBase = item;

			setFormData({
				name: itemBase.name || '',
				quantity: 1,
				category: itemBase.category?.id || '',
				client: itemBase.client?.id || '',
				designer: itemBase.designer?.id || '',
				location: itemBase.location || '',
				pieces: itemBase.pieces || []
			});
			setSelectedDesigner(itemBase.designer?.id || '');
			setPieces([
				{
					name: itemBase.name || '',
					status: itemBase.currentStatus || 'received',
					note: '',
					location: itemBase.location || '',
					imagesByStatus: itemBase.imagesByStatus || {},
					pieces: itemBase.pieces || []
				}
			]);
		} else {
			setFormData({
				name: '',
				quantity: 1,
				category: '',
				designer: '',
				client: '',
				location: '',
				pieces: []
			});
			setPieces([]);
		}
	}, [item]);

	useEffect(() => {
		if (formData.quantity && Number(formData.quantity) > 0) {
			const qty = Number(formData.quantity);
			setPieces((prevItems) => {
				let newItems = [...prevItems];
				newItems = newItems.map((item, index) => ({
					...item,
					name: `${formData.name || 'Item'} ${index + 1}`
				}));
				while (newItems.length < qty) {
					newItems.push({
						name: `${formData.name || 'Item'} ${newItems.length + 1}`,
						status: 'received',
						note: '',
						location: '',
						imagesByStatus: {},
						pieces: []
					});
				}
				return newItems.length > qty ? newItems.slice(0, qty) : newItems;
			});
		}
	}, [formData.quantity, formData.name]);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = 'Name is required';
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

		const normalizeImages = (input = {}) => {
			const obj = {};
			for (const key in input) {
				obj[key] = Array.isArray(input[key]) ? [...input[key]] : [];
			}
			return obj;
		};

		const cleanPieces = (input = []) =>
			input.map((p) => {
				const { __typename, imagesByStatus, ...rest } = p;
				return {
					...rest,
					imagesByStatus: normalizeImages(imagesByStatus)
				};
			});

		const payload = item?.id
			? {
					name: formData.name,
					category: formData.category,
					client: formData.client,
					designer: formData.designer,
					location: formData.location,
					currentStatus: pieces[0]?.status || 'received',
					imagesByStatus: normalizeImages(pieces[0]?.imagesByStatus),
					pieces: cleanPieces(pieces[0]?.pieces || [])
			  }
			: {
					name: formData.name,
					quantity: Number(formData.quantity),
					category: formData.category,
					client: formData.client,
					designer: formData.designer,
					location: formData.location,
					items: pieces
			  };

		try {
			if (item?.id) {
				await updateItem({ variables: { id: item.id, input: payload } });
				toast.toast({ title: '✅ Inventory item updated successfully!' });
			} else {
				await createItems({ variables: { input: payload } });
				toast.toast({ title: '✅ Inventory items created successfully!' });
			}
			setOpen(false);
			refetch && refetch();
		} catch (error) {
			console.error('Error:', error);
			toast.toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-auto p-6">
				<DialogHeader className="my-3">
					<DialogTitle className="text-2xl font-semibold">
						{item?.id ? 'Edit Inventory Item' : 'Register Inventory Items'}
					</DialogTitle>
				</DialogHeader>

				<InventoryForm
					formData={formData}
					setFormData={setFormData}
					errors={errors}
					setErrors={setErrors}
					categories={categoriesData?.getTypes || []}
					designers={userData?.getUsers?.filter((u) => u.role === 'designer' || u.role === 'client') || []}
					clients={clientsData?.getClientsByDesigner || []}
					clientsLoading={clientsLoading}
					handleSubmit={handleSubmit}
					setSelectedDesigner={setSelectedDesigner}
					isEditMode={!!item?.id}
				/>

				<InventoryPieceForm pieces={pieces} setPieces={setPieces} />

				<div className="flex justify-end">
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={creating || updating}
						className="mt-4 ml-2 bg-black hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
					>
						{creating || updating
							? item?.id
								? 'Updating...'
								: 'Registering...'
							: item?.id
							? 'Update Item'
							: 'Register Items'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddInventoryItemModal;
