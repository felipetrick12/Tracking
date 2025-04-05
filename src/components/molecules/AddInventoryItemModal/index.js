'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CREATE_MULTIPLE_INVENTORY_ITEMS } from '@/graphql/mutations/inventory';
import { GET_CATEGORIES } from '@/graphql/queries/type';
import { GET_CLIENTS_BY_DESIGNER, GET_USERS } from '@/graphql/queries/user';
import { useToast } from '@/hooks/use-toast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import InventoryForm from './components/InventoryForm';
import InventoryPieceForm from './components/InventoryPieceForm';

const AddInventoryItemModal = ({ open, setOpen, orders = [], refetch }) => {
	const toast = useToast();

	const { data: userData } = useQuery(GET_USERS);
	const { data: categoriesData } = useQuery(GET_CATEGORIES);
	const [fetchClients, { data: clientsData, loading: clientsLoading }] = useLazyQuery(GET_CLIENTS_BY_DESIGNER);
	const [createItems, { loading }] = useMutation(CREATE_MULTIPLE_INVENTORY_ITEMS);

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

				if (newItems.length > qty) {
					return newItems.slice(0, qty);
				}

				return newItems;
			});
		}
	}, [formData.quantity, formData.name]);

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
				name: formData.name,
				quantity: Number(formData.quantity),
				category: formData.category,
				client: formData.client,
				designer: formData.designer,
				location: formData.location,
				items: pieces
			};

			await createItems({ variables: { input: payload } });
			setOpen(false);
			refetch && refetch();
			toast.toast({ title: '✅ Inventory pieces created successfully!' });
		} catch (error) {
			console.error('Error creating inventory items:', error);
			toast.toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-auto p-6">
				<DialogHeader className="my-3">
					<DialogTitle className="text-2xl font-semibold">Register Inventory Items</DialogTitle>
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
				/>

				<InventoryPieceForm pieces={pieces} setPieces={setPieces} />

				<div className="flex justify-end">
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={loading}
						className="mt-4 ml-2 bg-black hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
					>
						{loading ? 'Registering...' : 'Register Items'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddInventoryItemModal;
