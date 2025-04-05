import { gql } from '@apollo/client';

export const CREATE_MULTIPLE_INVENTORY_ITEMS = gql`
	mutation CreateMultipleInventoryItems($input: CreateMultipleInventoryItemsInput!) {
		createMultipleInventoryItems(input: $input) {
			id
			name
			location
			currentStatus
			qrCode
			qrCodeImage
			imagesByStatus
			statusHistory {
				status
				changedAt
				note
				images
			}
			pieces {
				name
				status
				note
				imagesByStatus
				location
			}
			client {
				id
				name
			}
			designer {
				id
				name
			}
			category {
				id
				name
			}
			order {
				id
			}
		}
	}
`;
