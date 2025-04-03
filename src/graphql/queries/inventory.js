import { gql } from '@apollo/client';

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
