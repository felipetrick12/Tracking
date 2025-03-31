import { gql } from '@apollo/client';

export const GET_INVENTORY_ITEMS = gql`
	query GetInventoryItems($orderId: ID) {
		getInventoryItems(orderId: $orderId) {
			_id
			name
			status
			location
			qrCode
			qrCodeImage
			image
			categoryName
			orderType
			clientName
			designerName
			createdAt
		}
	}
`;
