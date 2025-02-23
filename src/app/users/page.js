'use client';

import AddUserForm from '@/components/AddUserForm';
import { UPDATE_USER } from '@/graphql/mutations/user';
import { GET_ORGANIZATIONS } from '@/graphql/queries/organization';
import { GET_ROLES, GET_USERS } from '@/graphql/queries/user';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

const UsersPage = () => {
	const { data, loading, error, refetch } = useQuery(GET_USERS);
	const { data: rolesData } = useQuery(GET_ROLES);
	const { data: orgsData } = useQuery(GET_ORGANIZATIONS);

	console.log('orgsData', data);

	const [updateUser] = useMutation(UPDATE_USER);

	const [editingUser, setEditingUser] = useState(null);
	const [updatedFields, setUpdatedFields] = useState({});

	// ✅ Handle field change
	const handleChange = (userId, field, value) => {
		setUpdatedFields({ ...updatedFields, [userId]: { ...updatedFields[userId], [field]: value } });
	};

	// ✅ Save Changes
	const handleSave = async (userId) => {
		try {
			const res = await updateUser({ variables: { id: userId, ...updatedFields[userId] } });
			console.log('res', res);

			setEditingUser(null);
			refetch(); // Refresh users
		} catch (error) {
			console.error('Error updating user:', error);
		}
	};

	// ✅ Cancel Edit
	const handleCancel = () => {
		setEditingUser(null);
		setUpdatedFields({});
	};

	if (loading) return <p>Loading users...</p>;
	if (error) return <p className="text-red-500">Error: {error.message}</p>;

	const users = data?.getUsers || [];
	const roles = rolesData?.getTypes || [];
	const organizations = orgsData?.getOrganizations || [];

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Users</h1>

			<AddUserForm onUserCreated={() => refetch()} />
			<table className="w-full border-collapse border border-gray-300 mt-4">
				<thead>
					<tr className="bg-gray-100">
						<th className="border p-2">Name</th>
						<th className="border p-2">Email</th>
						<th className="border p-2">Role</th>
						<th className="border p-2">Assigned Designer</th>
						<th className="border p-2">Organization</th>
						<th className="border p-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id} className="border">
							{/* ✅ Editable Name */}
							{/* ✅ Editable Name */}
							<td className="border p-2">
								{editingUser === user.id ? (
									<input
										type="text"
										value={
											updatedFields[user.id]?.name !== undefined
												? updatedFields[user.id]?.name
												: user.name
										}
										onChange={(e) => handleChange(user.id, 'name', e.target.value)}
										className="border p-1 w-full"
									/>
								) : (
									user.name
								)}
							</td>

							{/* ✅ Email (Read-Only) */}
							<td className="border p-2">{user.email}</td>

							{/* ✅ Editable Role */}
							<td className="border p-2">
								{editingUser === user.id ? (
									<select
										value={updatedFields[user.id]?.role || user.role}
										onChange={(e) => handleChange(user.id, 'role', e.target.value)}
										className="border p-1 w-full"
									>
										{roles.map((role) => (
											<option key={role.id} value={role.name}>
												{role.name}
											</option>
										))}
									</select>
								) : (
									<span className="capitalize">{user.role}</span>
								)}
							</td>

							{/* ✅ Editable Assigned Designer */}
							<td className="border p-2">
								{editingUser === user.id ? (
									<select
										value={updatedFields[user.id]?.assignedTo || user.assignedTo?.id || ''}
										onChange={(e) => handleChange(user.id, 'assignedTo', e.target.value)}
										className="border p-1 w-full"
									>
										<option value="">None</option>
										{users
											.filter((u) => u.role === 'designer')
											.map((designer) => (
												<option key={designer.id} value={designer.id}>
													{designer.name}
												</option>
											))}
									</select>
								) : user.assignedTo ? (
									user.assignedTo.name
								) : (
									'N/A'
								)}
							</td>

							{/* ✅ Editable Organization */}
							<td className="border p-2">
								{editingUser === user.id ? (
									<select
										value={
											updatedFields[user.id]?.activeOrganization ||
											user.organizations[0]?.id ||
											''
										}
										onChange={(e) => handleChange(user.id, 'activeOrganization', e.target.value)}
										className="border p-1 w-full"
									>
										{organizations.map((org) => (
											<option key={org.id} value={org.id}>
												{org.name}
											</option>
										))}
									</select>
								) : user.organizations.length > 0 ? (
									user.organizations[0].name
								) : (
									'N/A'
								)}
							</td>

							{/* ✅ Actions */}
							<td className="border p-2">
								{editingUser === user.id ? (
									<>
										<button
											className="bg-green-500 text-white px-2 py-1 rounded mr-2"
											onClick={() => handleSave(user.id)}
										>
											Save
										</button>
										<button
											className="bg-gray-500 text-white px-2 py-1 rounded"
											onClick={handleCancel}
										>
											Cancel
										</button>
									</>
								) : (
									<button
										className="bg-blue-500 text-white px-2 py-1 rounded"
										onClick={() => setEditingUser(user.id)}
									>
										Edit
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UsersPage;
