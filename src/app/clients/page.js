'use client';

import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { GET_ME } from '@/graphql/queries/auth';
import { GET_ALL_ORDERS } from '@/graphql/queries/order';
import { GET_MY_CLIENTS } from '@/graphql/queries/user';

import { OrdersTable } from '@/components/atoms';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const ClientOrdersDashboard = () => {
	const { data: userData } = useQuery(GET_ME);
	const userId = userData?.me?.id;

	const [selectedClient, setSelectedClient] = useState();

	const { data: clientsData, loading: loadingClients } = useQuery(GET_MY_CLIENTS, {
		skip: !userId
	});

	const { data: ordersData, loading: loadingOrders } = useQuery(GET_ALL_ORDERS, {
		variables: { clientId: selectedClient },
		skip: !selectedClient
	});

	const clients = clientsData?.getMyClients ?? [];
	const orders = ordersData?.getOrders ?? [];

	return (
		<div className="flex h-[calc(100vh-80px)]">
			{/* Sidebar - Clients */}
			<ScrollArea className="w-64 bg-muted p-4 border-r">
				<h2 className="font-semibold text-lg mb-4">My Clients</h2>
				{loadingClients ? (
					<p className="text-sm text-muted-foreground">Loading clients...</p>
				) : clients.length === 0 ? (
					<p className="text-sm text-muted-foreground">No clients found.</p>
				) : (
					<>
						{clients.map((client, index) => (
							<div key={client.id}>
								<Button
									variant={selectedClient === client.id ? 'default' : 'ghost'}
									className="w-full justify-start mb-1"
									onClick={() => setSelectedClient(client.id)}
								>
									{client.name}
								</Button>
								{index !== clients.length - 1 && <Separator className="my-2" />}
							</div>
						))}
					</>
				)}
			</ScrollArea>

			{/* Orders content */}
			<div className="flex-1 p-6 overflow-auto">
				<OrdersTable orders={orders} />
			</div>
		</div>
	);
};

export default ClientOrdersDashboard;
