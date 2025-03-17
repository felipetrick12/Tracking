import { useState } from 'react';
import OrderForm from './OrderForm';

const AddOrderButton = ({ onOrderCreated }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
				onClick={() => setOpen(true)}
			>
				+ Create Order
			</button>

			{/* Modal para crear orden */}
			{open && <OrderForm open={open} setOpen={setOpen} onOrderCreated={onOrderCreated} />}
		</>
	);
};

export default AddOrderButton;
