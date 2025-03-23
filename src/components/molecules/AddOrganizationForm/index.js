'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CREATE_ORGANIZATION } from '@/graphql/queries/organization';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

const AddOrganizationForm = ({ onOrganizationCreated }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	const [formData, setFormData] = useState({
		name: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		phone: '',
		notes: ''
	});

	const [createOrganization, { loading, error }] = useMutation(CREATE_ORGANIZATION, {
		onCompleted: async (data) => {
			await onOrganizationCreated(data.createOrganization);
			toast({ title: '✅ Organization created successfully!' });
			setIsOpen(false);
			setFormData({ name: '', address: '', city: '', state: '', zipCode: '', phone: '', notes: '' });
		}
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await createOrganization({ variables: formData });
	};

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Add Organization</Button>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Create Organization</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<Input
							required
							name="name"
							placeholder="Organization Name"
							value={formData.name}
							onChange={handleChange}
						/>
						<Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
						<Input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
						<Input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
						<Input name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} />
						<Input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
						<Textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />

						<div className="flex justify-end gap-2">
							<Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? 'Creating...' : 'Create'}
							</Button>
						</div>
						{error && <p className="text-red-500 text-sm">{error.message}</p>}
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AddOrganizationForm;
