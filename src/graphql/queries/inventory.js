import { gql } from '@apollo/client';

export const GET_INVENTORY_ITEMS = gql`
	query GetInventoryItems($orderId: ID) {
		getInventoryItems(orderId: $orderId) {
			_id
			name
			status
			order {
				id
			}
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

export const UPDATE_INVENTORY_ITEM = gql`
	mutation UpdateInventoryItem($id: ID!, $input: InventoryUpdateInput!) {
		updateInventoryItem(id: $id, input: $input) {
			_id
			name
			location
			status
			image
		}
	}
`;
