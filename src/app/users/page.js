'use client';

import AddUserForm from '@/components/molecules/AddUserForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_USERS } from '@/graphql/queries/user';
import { useQuery } from '@apollo/client';
import { UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const UsersPage = () => {
	const { data, loading, error, refetch } = useQuery(GET_USERS);
	const [editingUser, setEditingUser] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	if (loading) return <p className="text-muted-foreground">Loading users...</p>;
	if (error) return <p className="text-red-500">Error: {error.message}</p>;

	const users = data?.getUsers || [];

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Users</h1>
				<AddUserForm
					user={editingUser}
					setUser={setEditingUser}
					open={modalOpen}
					setOpen={setModalOpen}
					refetch={refetch}
				>
					<Button
						onClick={() => {
							setEditingUser(null); // ✅ limpia el estado
							setModalOpen(true); // ✅ abre el modal
						}}
					>
						Add User
					</Button>
				</AddUserForm>
			</div>
			<Card className="p-4 overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Photo</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Assigned Designer</TableHead>
							<TableHead>Organization</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<Avatar className="w-10 h-10">
										<AvatarImage src={user.photoUrl} alt={user.name} />
										<AvatarFallback>
											<UserIcon className="w-5 h-5 text-gray-400" />
										</AvatarFallback>
									</Avatar>
								</TableCell>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>{user.assignedTo?.name || 'N/A'}</TableCell>
								<TableCell>{user.organizations?.[0]?.name || 'N/A'}</TableCell>
								<TableCell className="text-right">
									<Button
										variant="secondary"
										size="sm"
										onClick={() => {
											setEditingUser(user);
											setModalOpen(true);
										}}
									>
										Edit
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default UsersPage;
