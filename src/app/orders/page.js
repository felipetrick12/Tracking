'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Package, Truck } from 'lucide-react';

const OrdersPage = () => {
	return (
		<div className="flex-1 p-6 overflow-auto">
			<Tabs defaultValue="pending" className="w-full">
				<TabsList className="mb-4 flex gap-2 flex-wrap">
					<TabsTrigger
						value="pending"
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
					>
						<Package size={16} />
						<span className="font-medium">Pending</span>
					</TabsTrigger>

					<TabsTrigger
						value="receiving"
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
					>
						<Truck size={16} />
						<span className="font-medium">Receiving</span>
					</TabsTrigger>

					<TabsTrigger
						value="shipped"
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
					>
						<Truck size={16} />
						<span className="font-medium">Shipped</span>
					</TabsTrigger>

					<TabsTrigger
						value="delivered"
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
					>
						<CheckCircle size={16} />
						<span className="font-medium">Delivered</span>
					</TabsTrigger>

					<TabsTrigger
						value="damaged"
						className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/10"
					>
						<AlertTriangle size={16} />
						<span className="font-medium">Damaged</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pending">{/* Tabla de órdenes pendientes (estado: 'pending') */}</TabsContent>

				<TabsContent value="receiving">
					{/* Órdenes que ya aceptó el admin pero aún no se han despachado */}
				</TabsContent>

				<TabsContent value="shipped">{/* Órdenes que están en manos del shipper */}</TabsContent>

				<TabsContent value="delivered">{/* Órdenes entregadas exitosamente */}</TabsContent>

				<TabsContent value="damaged">{/* Órdenes con problemas o productos dañados */}</TabsContent>
			</Tabs>
		</div>
	);
};

export default OrdersPage;
