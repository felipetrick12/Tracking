'use client';

import { useMutation, useQuery } from '@apollo/client';
import { UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import { CREATE_USER, UPDATE_USER } from '@/graphql/mutations/user';
import { GET_ME } from '@/graphql/queries/auth';
import { GET_ORGANIZATIONS } from '@/graphql/queries/organization';
import { GET_ROLES, GET_USERS_BY_ROLE } from '@/graphql/queries/user';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const AddUserForm = ({ children, user = null, setUser, refetch, open, setOpen }) => {
	const { data: rolesData } = useQuery(GET_ROLES);
	const { data: orgsData } = useQuery(GET_ORGANIZATIONS);
	const { data: userData } = useQuery(GET_ME);

	const { toast } = useToast();

	const isSuperadmin = userData?.me?.role === 'superadmin';

	const { data: designersData } = useQuery(GET_USERS_BY_ROLE, {
		variables: isSuperadmin
			? { role: 'designer' }
			: {
					role: 'designer',
					organizationId: userData?.me?.activeOrganization?.id
			  },
		skip: !userData?.me || (!isSuperadmin && !userData?.me?.activeOrganization?.id)
	});

	const { data: clientsData } = useQuery(GET_USERS_BY_ROLE, {
		variables: isSuperadmin
			? { role: 'client' }
			: {
					role: 'client',
					organizationId: userData?.me?.activeOrganization?.id
			  },
		skip: !userData?.me || (!isSuperadmin && !userData?.me?.activeOrganization?.id)
	});

	const [createUser] = useMutation(CREATE_USER);
	const [updateUser] = useMutation(UPDATE_USER);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		activeOrganization: '',
		assignedTo: '',
		photo: null,
		address: '',
		phone: ''
	});

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [previewImage, setPreviewImage] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open) return;
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				password: '',
				role: user.role || '',
				activeOrganization: user.organizations?.[0]?.id || '',
				assignedTo: user.assignedTo?.id || '',
				photo: null,
				address: user.address || '',
				phone: user.phone || ''
			});
			setPreviewImage(user.photoUrl || null);
		} else {
			resetForm();
		}
	}, [user, open]);

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			password: '',
			role: '',
			activeOrganization: '',
			assignedTo: '',
			photo: null,
			address: '',
			phone: ''
		});
		setPreviewImage(null);
		setErrors({});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name) newErrors.name = 'Name is required';
		if (!formData.email) newErrors.email = 'Email is required';
		if (!user && !formData.password) newErrors.password = 'Password is required';
		if (!formData.role) newErrors.role = 'Role is required';
		if (formData.role === 'user' && !formData.assignedTo) newErrors.assignedTo = 'Designer is required';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleCancel = () => {
		resetForm();
		setOpen(false);
		setUser(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			toast({ title: 'Please fix the errors in the form.' });
			return;
		}
		setErrors({});
		setLoading(true);
		try {
			let base64Image = null;
			if (formData.photo) {
				const reader = new FileReader();
				reader.readAsDataURL(formData.photo);
				await new Promise((resolve) => (reader.onload = () => resolve()));
				base64Image = reader.result;
			}

			const variables = {
				...(formData.name !== user?.name && { name: formData.name }),
				...(formData.role !== user?.role && { role: formData.role }),
				...(formData.assignedTo !== user?.assignedTo?.id && { assignedTo: formData.assignedTo }),
				activeOrganization: formData.activeOrganization,
				...(base64Image && { photoUrl: base64Image }),
				...(formData.address && { address: formData.address }),
				...(formData.phone && { phone: formData.phone })
			};

			if (user) {
				await updateUser({ variables: { id: user.id, ...variables } });
				toast({ title: '✅ User updated successfully!', icon: '🚀' });
			} else {
				console.log('formData', formData);

				await createUser({ variables: { ...formData, photoUrl: base64Image } });
				toast({ title: '✅ User created successfully!', icon: '🚀' });
			}

			await refetch();
			setOpen(false);
		} catch (err) {
			toast({ title: `❌ Error: ${err.message}` });
		} finally {
			setLoading(false);
		}
	};

	const designers = designersData?.getUsersByRole || [];
	const clients = clientsData?.getUsersByRole || [];
	const assignableUsers = [...designers, ...clients];

	return (
		<>
			{children ? children : <Button onClick={() => setOpen(true)}>Add User</Button>}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-5xl">
					<DialogHeader>
						<DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
						<div className="flex flex-col items-center space-y-4">
							<Avatar className="w-32 h-32">
								<AvatarImage src={previewImage || undefined} />
								<AvatarFallback>
									<UserIcon className="w-6 h-6 text-gray-400" />
								</AvatarFallback>
							</Avatar>
							<Input
								type="file"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files[0];
									if (file) {
										setPreviewImage(URL.createObjectURL(file));
										setFormData((prev) => ({ ...prev, photo: file }));
									}
								}}
							/>
						</div>
						<div className="space-y-4">
							<div>
								<Label>Name</Label>
								<Input
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Full Name"
								/>
							</div>

							<div>
								<Label>Email</Label>
								<Input type="email" name="email" value={formData.email} onChange={handleChange} />
							</div>
							{!user && (
								<div className="relative">
									<Label>Password</Label>
									<Input
										type={showPassword ? 'text' : 'password'}
										name="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Password"
									/>
									<button
										type="button"
										className="absolute right-2 top-9 text-gray-500 hover:text-black"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
								</div>
							)}
							<div>
								<Label>Phone</Label>
								<Input
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="Phone number"
								/>
							</div>
							<div>
								<Label>Address</Label>
								<Input
									name="address"
									value={formData.address}
									onChange={handleChange}
									placeholder="Address"
								/>
							</div>
							<div>
								<Label>Role</Label>
								<Select
									value={formData.role}
									onValueChange={(value) =>
										setFormData((prev) => ({ ...prev, role: value, assignedTo: '' }))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										{rolesData?.getTypes
											.filter((role) =>
												userData?.me?.role !== 'superadmin' ? role.name !== 'superadmin' : true
											)
											.map((role) => (
												<SelectItem key={role.id} value={role.name}>
													{role.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>

							{formData.role === 'user' && (
								<div>
									<Label>Assign Designer</Label>
									<Select
										value={formData.assignedTo}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, assignedTo: value }))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select designer" />
										</SelectTrigger>
										<SelectContent>
											{assignableUsers.map((designer) => (
												<SelectItem key={designer.id} value={designer.id}>
													{designer.name}
													{userData?.me?.role === 'superadmin' &&
														designer.organizations?.length > 0 && (
															<span className="ml-2 text-xs text-muted-foreground">
																({designer.organizations[0]?.name})
															</span>
														)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}
							{/* Organization */}
							{userData?.me?.role === 'superadmin' && (
								<div>
									<Label>Organization</Label>
									<Select
										value={formData.activeOrganization}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, activeOrganization: value }))
										}
									>
										<SelectTrigger className={errors.activeOrganization && 'border-red-500'}>
											<SelectValue placeholder="Select organization" />
										</SelectTrigger>
										<SelectContent>
											{orgsData?.getOrganizations.map((org) => (
												<SelectItem key={org.id} value={org.id}>
													{org.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.activeOrganization && (
										<p className="text-red-500 text-sm mt-1">{errors.activeOrganization}</p>
									)}
								</div>
							)}
						</div>

						{/* Buttons */}
						<div className="col-span-2 flex justify-end gap-4">
							<Button type="button" onClick={handleCancel} disabled={loading}>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? 'Saving...' : 'Save'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AddUserForm;
