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
	const [formData, setFormData] = useState({
		name: '',
		quantity: 1,
		category: '',
		client: '',
		designer: '',
		location: ''
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (selectedDesigner) {
			fetchClients({ variables: { designerId: selectedDesigner } });
		}
	}, [selectedDesigner]);

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
			await createItems({ variables: { input: { ...formData, quantity: Number(formData.quantity) } } });
			toast.toast({ title: '✅ Inventory items created successfully!' });
			setOpen(false);
			refetch && refetch();
		} catch (error) {
			console.error('Error creating inventory items:', error);
			toast.toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
		}
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
