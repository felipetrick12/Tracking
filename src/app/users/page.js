'use client';

import AddUserForm from '@/components/molecules/AddUserForm';
import { GET_USERS } from '@/graphql/queries/user';
import { useQuery } from '@apollo/client';
import { UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const UsersPage = () => {
	const { data, loading, error, refetch } = useQuery(GET_USERS);

	const [editingUser, setEditingUser] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	if (loading) return <p>Loading users...</p>;
	if (error) return <p className="text-red-500">Error: {error.message}</p>;

	const users = data?.getUsers || [];

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Users</h1>

			<div className="flex justify-end items-center">
				<AddUserForm
					open={modalOpen}
					setOpen={setModalOpen}
					user={editingUser}
					onUserChange={() => {
						refetch();
						setEditingUser(null);
					}}
				/>
			</div>

			<table className="mt-4 min-w-full text-left text-sm text-gray-500 border-collapse">
				<thead>
					<tr className="text-gray-700 bg-gray-100 border-b text-sm font-semibold">
						<th className="px-6 py-3">Photo</th>
						<th className="px-6 py-3">Name</th>
						<th className="px-6 py-3">Email</th>
						<th className="px-6 py-3">Role</th>
						<th className="px-6 py-3">Assigned Designer</th>
						<th className="px-6 py-3">Organization</th>
						<th className="px-6 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id} className="border-b hover:bg-gray-50">
							<td className="px-6 py-4">
								{user.photoUrl ? (
									<img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full" />
								) : (
									<UserIcon className="w-10 h-10 text-gray-400" />
								)}
							</td>
							<td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
							<td className="px-6 py-4">{user.email}</td>
							<td className="px-6 py-4 capitalize">{user.role}</td>
							<td className="px-6 py-4">{user.assignedTo ? user.assignedTo.name : 'N/A'}</td>
							<td className="px-6 py-4">
								{user.organizations.length > 0 ? user.organizations[0].name : 'N/A'}
							</td>
							<td className="px-6 py-4 text-right">
								<button
									className="bg-blue-500 text-white px-3 py-1 rounded"
									onClick={() => {
										setEditingUser(user);
										setModalOpen(true);
									}}
								>
									Edit
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UsersPage;
