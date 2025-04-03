'use client';

import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { GET_ME } from '@/graphql/queries/auth';
import { GET_MY_CLIENTS } from '@/graphql/queries/user';

import { AddAdminOrderModal, AddClientOrderModal, InventoryClientTable } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClientOrdersDashboard = () => {
	const { data: userData } = useQuery(GET_ME);
	const userId = userData?.me?.id;

	const [selectedClient, setSelectedClient] = useState();
	const [selectedItems, setSelectedItems] = useState([]);
	const [openModal, setOpenModal] = useState(false);

	const { data: clientsData, loading: loadingClients } = useQuery(GET_MY_CLIENTS, {
		skip: !userId
	});

	const clients = clientsData?.getMyClients ?? [];

	return (
		<div className="flex h-[calc(100vh-80px)]">
			{/* Sidebar - Clients */}
			<ScrollArea className="w-64 bg-muted p-4 border-r">
				{loadingClients ? (
					<p className="text-sm text-muted-foreground">Loading clients...</p>
				) : clients.length === 0 ? (
					<p className="text-sm text-muted-foreground">No clients found.</p>
				) : (
					<>
						{clients.map((client, index) => (
							<div key={client.id}>
								<Button
									variant={selectedClient?.id === client.id ? 'default' : 'ghost'}
									className="w-full justify-start mb-1"
									onClick={() =>
										setSelectedClient({
											id: client.id,
											name: client.name
										})
									}
								>
									{client.name}
								</Button>
								{index !== clients.length - 1 && <Separator className="my-2" />}
							</div>
						))}
					</>
				)}
			</ScrollArea>

			{/* Main content */}
			<div className="flex-1 p-6 overflow-auto">
				{selectedClient?.id ? (
					<Tabs defaultValue="inventory" className="w-full">
						<TabsList className="mb-4 gap-2 flex justify-between">
							<div className="flex gap-2">
								<TabsTrigger
									value="inventory"
									className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
								>
									<span className="text-lg">📦</span>
									<span className="font-medium">Inventory</span>
								</TabsTrigger>
								<TabsTrigger
									value="workorders"
									className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
								>
									<span className="text-lg">🚚</span>
									<span className="font-medium">Work Orders</span>
								</TabsTrigger>
							</div>
							{selectedItems.length > 0 && (
								<Button
									className="ml-auto py-2 px-4 rounded-lg text-white bg-primary hover:bg-primary-dark"
									onClick={() => setOpenModal(true)}
								>
									Create Order
								</Button>
							)}
						</TabsList>

						<TabsContent value="inventory">
							<InventoryClientTable
								selectedClient={selectedClient}
								selectedItems={selectedItems}
								setSelectedItems={setSelectedItems}
							/>
						</TabsContent>

						<TabsContent value="workorders">
							{/* <WorkOrdersClientTable selectedClient={selectedClient} /> */}
						</TabsContent>
					</Tabs>
				) : (
					<p className="text-muted-foreground text-center mt-20">Select a client to view their details</p>
				)}

				<AddClientOrderModal
					selectedItems={selectedItems}
					setSelectedItems={setSelectedItems}
					open={openModal}
					setOpen={setOpenModal}
					selectedClient={selectedClient}
				/>
			</div>
		</div>
	);
};

export default ClientOrdersDashboard;
