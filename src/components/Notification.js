'use client';
import { useEffect, useState } from 'react';

/**
 * Notification component to display success or error messages.
 * @param {Object} props - Props for the notification.
 * @param {string} props.message - The message to display.
 * @param {'success' | 'error'} props.type - Type of notification.
 * @param {number} [props.duration=3000] - Duration before auto-dismiss (ms).
 */
const Notification = ({ message, type = 'success', duration = 3000 }) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), duration);
		return () => clearTimeout(timer);
	}, [duration]);

	if (!visible) return null;

	return (
		<div
			className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-md text-white shadow-md transition-opacity ${
				type === 'success' ? 'bg-green-500' : 'bg-red-500'
			}`}
		>
			{message}
			<button className="ml-3 text-white font-bold" onClick={() => setVisible(false)}>
				✕
			</button>
		</div>
	);
};

export default Notification;
