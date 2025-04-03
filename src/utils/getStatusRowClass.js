export const getStatusRowClass = (status) => {
	switch (status) {
		case 'pending':
			return 'bg-yellow-50';
		case 'received':
			return 'bg-blue-50';
		case 'shipped':
			return 'bg-green-50';
		case 'delivered':
		case 'complete':
			return 'bg-purple-50';
		case 'damaged':
			return 'bg-red-50';
		case 'stored':
			return 'bg-gray-50';
		default:
			return '';
	}
};
