'use client';

import { CREATE_USER, UPDATE_USER } from '@/graphql/mutations/user';
import { GET_ORGANIZATIONS } from '@/graphql/queries/organization';
import { GET_ROLES, GET_USERS } from '@/graphql/queries/user';
import { useMutation, useQuery } from '@apollo/client';
import { UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUserForm = ({ children, user = null, onUserChange, open, setOpen }) => {
	const { data: rolesData } = useQuery(GET_ROLES, { pollInterval: 10000, skip: !open });
	const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { pollInterval: 10000, skip: !open });
	const { data: clients } = useQuery(GET_USERS, { pollInterval: 10000, skip: !open });

	const [createUser] = useMutation(CREATE_USER);
	const [updateUser] = useMutation(UPDATE_USER);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		activeOrganization: '',
		assignedTo: '',
		photo: null
	});
	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				password: '',
				role: user.role || '',
				activeOrganization: user.organizations?.[0]?.id || '',
				assignedTo: user.assignedTo?.id || '',
				photo: null
			});
			setPreviewImage(user.photoUrl || null);
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
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
				...(formData.activeOrganization !== user?.organizations?.[0]?.id && {
					activeOrganization: formData.activeOrganization
				}),
				...(base64Image && { photoUrl: base64Image })
			};

			if (user) {
				await updateUser({ variables: { id: user.id, ...variables } });
				onUserChange();
				toast.success('✅ User updated successfully!');
			} else {
				await createUser({ variables: { ...formData, photoUrl: base64Image } });
				onUserChange();
				toast.success('✅ User created successfully!');
			}

			setOpen(false);
		} catch (error) {
			toast.error(`❌ Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{children ? (
				children
			) : (
				<button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setOpen(true)}>
					Add User
				</button>
			)}

			{open && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-10 rounded-lg shadow-lg w-[930px]">
						<h2 className="text-xl font-bold mb-4 text-gray-800">{user ? 'Edit User' : 'Create User'}</h2>

						<form onSubmit={handleSubmit} className="flex flex-col gap-6">
							<div className="flex gap-6">
								<div className="w-1/4 items-start justify-start">
									<div className="relative w-44 h-44 flex flex-col items-center justify-center cursor-pointer rounded border border-gray-300">
										{previewImage ? (
											<img
												src={previewImage}
												alt="Preview"
												className="w-full h-full object-cover p-6"
											/>
										) : (
											<UserIcon className="w-8 h-8 text-gray-400" />
										)}
										<input
											type="file"
											className="absolute inset-0 opacity-0 cursor-pointer"
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
								</div>
								<div className="w-3/4 space-y-4">
									{/* 🟡 First Row */}
									<div className="flex w-full gap-4 flex-wrap">
										<div className="flex flex-col gap-2 w-2/2">
											<label className="text-gray-700 font-medium text-sm">Full Name</label>
											<input
												type="text"
												name="name"
												placeholder="Full Name"
												className="border border-gray-300 p-2 rounded-md text-[14px] focus:border-black focus:outline-none transition-all duration-300"
												onChange={handleChange}
												value={formData.name}
												required
											/>
										</div>

										<div className="flex flex-col gap-2 w-2/2">
											<label className="text-gray-700 font-medium text-sm">Email</label>
											<input
												type="email"
												name="email"
												placeholder="Email"
												className="border border-gray-300 p-2 rounded-md text-[14px] focus:border-black focus:outline-none transition-all duration-300"
												onChange={handleChange}
												value={formData.email}
												required
											/>
										</div>
									</div>

									{/* 🟡 Second Row */}
									<div className="flex gap-4">
										{!user && (
											<div className="flex flex-col gap-2 w-full">
												<label className="text-gray-700 font-medium text-sm">Password</label>
												<input
													type="password"
													name="password"
													placeholder="Password"
													className="border border-gray-300 p-2 rounded-md text-[14px] focus:border-black focus:outline-none transition-all duration-300"
													onChange={handleChange}
													value={formData.password}
													required
												/>
											</div>
										)}

										<div className="flex flex-col gap-2 w-full">
											<label className="text-gray-700 font-medium text-sm">Role</label>
											<select
												name="role"
												value={formData.role}
												onChange={handleChange}
												className="border border-gray-300 p-2 rounded-md text-[14px] focus:border-black focus:outline-none transition-all duration-300"
												required
											>
												<option value="">Select Role</option>
												{rolesData?.getTypes.map((role) => (
													<option key={role.id} value={role.name}>
														{role.name}
													</option>
												))}
											</select>
										</div>

										<div className="flex flex-col gap-2">
											<label className="text-gray-700 font-medium text-sm">Organization</label>
											<select
												name="activeOrganization"
												value={formData.activeOrganization}
												onChange={handleChange}
												className="border border-gray-300 p-2 rounded-md text-[14px] focus:border-black focus:outline-none transition-all duration-300"
											>
												<option value="">Select Organization</option>
												{orgsData?.getOrganizations.map((org) => (
													<option key={org.id} value={org.id}>
														{org.name}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-4">
								<button
									type="button"
									onClick={handleCancel}
									className="bg-gray-500 text-white px-6 py-2 rounded-md"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-black text-white px-6 py-2 rounded-md"
									disabled={loading}
								>
									{loading ? 'Saving...' : 'Save'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AddUserForm;
