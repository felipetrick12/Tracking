import { gql } from '@apollo/client';

export const CREATE_MULTIPLE_INVENTORY_ITEMS = gql`
	mutation CreateMultipleInventoryItems($input: CreateMultipleInventoryItemsInput!) {
		createMultipleInventoryItems(input: $input) {
			id
			name
			location
			currentStatus
			qrCode
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
