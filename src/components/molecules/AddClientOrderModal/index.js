'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { CREATE_ORDER_CLIENT, UPDATE_ORDER } from '@/graphql/mutations/order';
import { GET_ME } from '@/graphql/queries/auth';
import { GET_CATEGORIES } from '@/graphql/queries/type';
import { useToast } from '@/hooks/use-toast';

const defaultFormDataDesigner = {
	description: '',
	quantity: 1,
	status: 'pending',
	designer: '',
	client: '',
	category: ''
};

const AddClientOrderModal = ({ open, setOpen, order = null, refetch, selectedClient }) => {
	const isEditMode = !!order;
	const { toast } = useToast();

	const [createOrderClient, { loading: creating }] = useMutation(CREATE_ORDER_CLIENT);
	const [updateOrder, { loading: updating }] = useMutation(UPDATE_ORDER);

	const { data: meData } = useQuery(GET_ME);
	const { data: categoriesData } = useQuery(GET_CATEGORIES);
	const userId = meData?.me?.id;
	const categories = categoriesData?.getTypes || [];

	const [formData, setFormData] = useState({ ...defaultFormDataDesigner });
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (order) {
			setFormData({
				...defaultFormDataDesigner,
				...order,
				designer: userId,
				client: selectedClient.id
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

	const validateForm = () => {
		const newErrors = {};
		if (!formData.description) newErrors.description = 'Description is required';
		if (!formData.category) newErrors.category = 'Category is required';
		if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';

		return newErrors;
	};

	const sanitizeOrderInput = (data) => {
		const clone = { ...data };
		const fieldsToRemove = ['__typename', 'id', 'createdAt', 'updatedAt', 'receivedOn'];
		fieldsToRemove.forEach((field) => delete clone[field]);

		clone.quantity = parseInt(data.quantity, 10);
		clone.orderType = 'pending';

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
				await createOrderClient({ variables: { input: cleanInput } });
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
		setFormData({ ...defaultFormDataDesigner });
		setErrors({});
	};

	return (
		<Dialog open={open} onOpenChange={handleCancel}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
				<DialogHeader className={'mb-4'}>
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
						{ label: 'Quantity', name: 'quantity', type: 'number' }
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

					<div className="col-span-2 flex justify-end gap-4 mt-6">
						<Button
							type="button"
							variant="secondary"
							onClick={handleCancel}
							disabled={creating || updating}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={creating || updating}>
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
