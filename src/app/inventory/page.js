'use client';

import { InventoryTable } from '@/components/molecules';

const InventoryPage = () => {
	return (
		<div className="flex h-[calc(100vh-80px)]">
			<div className="flex-1 p-6 overflow-auto">
				<InventoryTable />
			</div>
		</div>
	);
};

export default InventoryPage;
