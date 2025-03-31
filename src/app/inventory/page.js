'use client';

const InventoryPage = () => {
	return (
		<div className="flex h-[calc(100vh-80px)]">
			<h1>Inventory</h1>
			{/* Orders content */}
			<div className="flex-1 p-6 overflow-auto">
				<InventoryTable orders={orders} selectedClient={selectedClient} refetch={refetch} />
			</div>
		</div>
	);
};

export default InventoryPage;
