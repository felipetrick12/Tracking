import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

const InventoryForm = ({
	formData,
	setFormData,
	errors,
	setErrors,
	categories,
	designers,
	clients,
	clientsLoading,
	handleSubmit,
	setSelectedDesigner,
	isEditMode
}) => {
	useEffect(() => {
		if (formData.quantity && Number(formData.quantity) > 0) {
			const qty = Number(formData.quantity);
			const newPieces = Array.from({ length: qty }, (_, index) => ({
				name: `${formData.name || 'Item'} ${index + 1}`,
				status: 'received',
				note: '',
				imagesByStatus: {}
			}));
			setFormData((prev) => ({ ...prev, pieces: newPieces }));
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

	return (
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
						disabled={isEditMode}
						className={isEditMode ? 'opacity-50 cursor-not-allowed' : ''}
					/>
					{errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
				</div>
			</div>

			<div>
				<Label>Category</Label>
				<Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
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
					value={formData.designer}
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
				<Select value={formData.client} onValueChange={(value) => handleSelectChange('client', value)}>
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
		</form>
	);
};

export default InventoryForm;
