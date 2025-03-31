import { Notification } from '@/components/atoms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CREATE_TYPE } from '@/graphql/queries/type';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

const AddTypeModal = ({ icon, title, description, typeLabel }) => {
	//Hooks
	const [createType, { loading }] = useMutation(CREATE_TYPE);
	const { toast } = useToast();

	//Local state
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({ name: '', description: '' });
	const [errors, setErrors] = useState({
		name: '',
		description: '',
		type: ''
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validación de campos
		if (!formData.name) {
			setErrors({ name: 'Name is required' });
			return;
		}

		try {
			// Mutation de GraphQL
			const { data } = await createType({
				variables: {
					type: typeLabel || 'orders',
					name: formData.name,
					description: formData.description
				}
			});

			if (data?.createType?.id) {
				toast({ title: `✅ ${typeLabel} created successfully!` });

				setFormData({ name: '', description: '' });
				setOpen(false);
			} else {
				toast({
					variant: 'destructive',
					title: `❌ Could not create ${typeLabel}`
				});
			}
		} catch (error) {
			Notification({
				type: 'error',
				message: error?.message || `Unexpected error while creating ${typeLabel}.`
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Card className="p-4 cursor-pointer hover:shadow-md transition">
					<CardHeader className="flex items-start justify-start">{icon()}</CardHeader>
					<CardContent className="flex flex-col items-start">
						<CardTitle>{title}</CardTitle>
						<CardDescription className="text-muted-foreground mt-2">Type: {typeLabel}</CardDescription>
					</CardContent>
				</Card>
			</DialogTrigger>

			<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-10">
				<DialogHeader className="mb-4">
					<DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
					<DialogDescription>Create a new {typeLabel} with a name and description.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
					<div className="flex flex-col gap-2">
						<Label>Name</Label>
						<Input
							value={formData.name}
							onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
							className={errors.name ? 'border border-red-500' : ''}
						/>
						{errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
					</div>

					<div className="flex flex-col gap-2">
						<Label>Description</Label>
						<Textarea
							value={formData.description}
							onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
							placeholder="Enter a description for this type..."
							className="resize-y min-h-[100px]"
						/>
					</div>

					<div className="col-span-2 flex justify-end gap-4 mt-4">
						<Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? 'Creating...' : 'Create'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddTypeModal;
