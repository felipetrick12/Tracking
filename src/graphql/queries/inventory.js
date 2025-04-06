import { gql } from '@apollo/client';

export const GET_ALL_INVENTORY = gql`
	query GetInventoryByOrganization {
		getInventoryByOrganization {
			id
			name
			location
			qrCode
			qrCodeImage
			currentStatus
			createdAt
			order {
				id
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
		}
	}
`;

export const GET_INVENTORY_BY_CLIENT = gql`
	query GetInventoryByClient($clientId: ID!) {
		getInventoryByClient(clientId: $clientId) {
			id
			name
			qrCode
			qrCodeImage
			currentStatus
			location
			createdAt
			imagesByStatus
			pieces {
				name
				status
				note
				location
				imagesByStatus
			}
			category {
				id
				name
			}
			client {
				id
				name
			}
			statusHistory {
				status
				changedAt
				note
				images
				changedBy {
					id
					name
				}
			}
		}
	}
`;

export const GET_INVENTORY_ITEM_BY_ID = gql`
	query GetInventoryItemById($id: ID!) {
		getInventoryItemById(id: $id) {
			id
			name
			location
			qrCode
			currentStatus
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
			createdAt
			statusHistory {
				status
				changedAt
				note
				images
				changedBy {
					id
					name
				}
			}
		}
	}
`;
