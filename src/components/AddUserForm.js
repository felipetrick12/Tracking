'use client';

import { CREATE_USER } from '@/graphql/mutations/user';
import { GET_ME } from '@/graphql/queries/auth';
import { GET_ORGANIZATIONS } from '@/graphql/queries/organization';
import { GET_DESIGNERS, GET_ROLES, GET_USERS_BY_ROLE } from '@/graphql/queries/user';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

const AddUserForm = ({ onUserCreated }) => {
	const { data: userData } = useQuery(GET_ME); // Obtiene el usuario autenticado

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		activeOrganization: '',
		assignedTo: ''
	});
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [createUser] = useMutation(CREATE_USER);
	const { data: rolesData } = useQuery(GET_ROLES);
	const { data: orgsData } = useQuery(GET_ORGANIZATIONS);
	const { data: designersData, refetch: refetchDesigners } = useQuery(GET_USERS_BY_ROLE, {
		variables: { role: 'designer', organizationId: userData?.me?.activeOrganization?.id }
	});

	// ✅ Handle input change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// ✅ Submit form
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			console.log('Submitting:', formData);

			const { data } = await createUser({ variables: formData });

			if (data?.createUser) {
				alert('✅ User created successfully!');

				// ✅ Refresh Designers list if the new user is a designer
				if (formData.role === 'designer') {
					await refetchDesigners();
				}

				onUserCreated();
				setIsOpen(false);
				setFormData({ name: '', email: '', password: '', role: '', activeOrganization: '', assignedTo: '' });
			}
		} catch (error) {
			alert('❌ Error creating user!');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* 🔹 Open Modal Button */}
			<button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
				Add User
			</button>

			{/* 🔹 Modal */}
			{isOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-10 rounded-lg shadow-lg w-[450px]">
						<h2 className="text-lg font-bold mb-5">Add User</h2>
						<form onSubmit={handleSubmit} className="space-y-5">
							<input
								type="text"
								name="name"
								placeholder="Full Name"
								className="border p-3 w-full"
								onChange={handleChange}
								value={formData.name}
								required
							/>
							<input
								type="email"
								name="email"
								placeholder="Email"
								className="border p-3 w-full"
								onChange={handleChange}
								value={formData.email}
								required
							/>
							<input
								type="password"
								name="password"
								placeholder="Password"
								className="border p-3 w-full"
								onChange={handleChange}
								value={formData.password}
								required
							/>

							{/* 🔹 Select Role */}
							<select
								name="role"
								value={formData.role}
								onChange={handleChange}
								className="border p-3 w-full"
								required
							>
								<option value="">Select Role</option>
								{rolesData?.getTypes.map((role) => (
									<option key={role.id} value={role.name}>
										{role.name}
									</option>
								))}
							</select>

							{/* 🔹 Select Organization */}
							<select
								name="activeOrganization"
								value={formData.activeOrganization}
								onChange={handleChange}
								className="border p-3 w-full"
							>
								<option value="">Select Organization</option>
								{orgsData?.getOrganizations.map((org) => (
									<option key={org.id} value={org.id}>
										{org.name}
									</option>
								))}
							</select>

							{/* 🔹 Select Assigned Designer (if role is CLIENT) */}
							{formData.role === 'client' && (
								<select
									name="assignedTo"
									value={formData.assignedTo}
									onChange={handleChange}
									className="border p-3 w-full"
								>
									<option value="">Select Designer</option>
									{designersData?.getUsersByRole.map((designer) => (
										<option key={designer.id} value={designer.id}>
											{designer.name}
										</option>
									))}
								</select>
							)}

							{/* 🔹 Submit Button */}
							<button
								type="submit"
								className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
								disabled={loading}
							>
								{loading ? 'Saving...' : 'Save'}
							</button>

							{/* 🔹 Cancel Button */}
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="bg-gray-500 text-white px-4 py-2 rounded-md w-full mt-2"
							>
								Cancel
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AddUserForm;
