'use client';

import { CREATE_USER, UPDATE_USER } from '@/graphql/mutations/user';
import { GET_ORGANIZATIONS } from '@/graphql/queries/organization';
import { GET_ROLES } from '@/graphql/queries/user';
import { useMutation, useQuery } from '@apollo/client';
import { UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const AddUserForm = ({ user = null, onUserUpdated, onUserCreated, open, setOpen }) => {
	const { data: rolesData } = useQuery(GET_ROLES);
	const { data: orgsData } = useQuery(GET_ORGANIZATIONS);
	const [createUser] = useMutation(CREATE_USER);
	const [updateUser] = useMutation(UPDATE_USER);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		activeOrganization: '',
		photo: null
	});
	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);

	// ✅ Handle Submit
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				password: '',
				role: user.role || '',
				activeOrganization: user.organizations?.[0]?.id || '',
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
		setFormData({
			name: '',
			email: '',
			password: '',
			role: '',
			activeOrganization: '',
			photo: null
		});
		setPreviewImage(null);
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
				...formData,
				photoUrl: base64Image || user?.photoUrl || null
			};

			if (user) {
				await updateUser({ variables: { id: user.id, ...variables } });
				onUserUpdated();
				alert('✅ User updated successfully!');
			} else {
				await createUser({ variables });
				onUserCreated();
				alert('✅ User created successfully!');
			}

			setOpen(false);
		} catch (error) {
			alert(`❌ Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* 🔹 Open Modal Button */}
			<button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
				Create User
			</button>

			{/* 🔹 Modal */}
			{open && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-[930px]">
						<h2 className="text-xl font-bold mb-4 text-gray-800">Create User</h2>

						<form onSubmit={handleSubmit} className="space-y-5">
							{/* 📌 Layout en 2 columnas */}
							<div className="flex gap-6">
								{/* 🔹 Profile Image Upload (Izquierda) */}
								<div className="w-1/3 flex flex-col items-center">
									<div className="relative w-44 h-44 flex flex-col  items-center justify-center cursor-pointer rounded border border-gray-300">
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
											className="absolute inset-0 opacity-0 cursor-pointer "
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

									<p className="text-gray-500 text-sm mt-2">Max: 2MB</p>
								</div>

								{/* 🔹 User Form Fields (Derecha) */}
								<div className="w-2/3 space-y-4">
									{/* 🟡 First Row */}
									<div className="flex gap-4">
										<div className="flex flex-col gap-2 w-full">
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

										<div className="flex flex-col gap-2 w-full">
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

									{/* 🟡 Third Row */}
								</div>
							</div>

							{/* 📌 Footer Buttons */}
							<div className="flex justify-end space-x-3 mt-6">
								<button
									type="button"
									onClick={() => handleCancel()}
									className="bg-gray-600 text-white px-6 py-2 rounded-md"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-yellow-900 text-white px-6 py-2 rounded-md transition-all hover:bg-yellow-700"
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
