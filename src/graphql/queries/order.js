import { gql } from '@apollo/client';

// ✅ Obtener TODAS las órdenes
export const GET_ORDERS = gql`
	query GetOrders($clientId: ID, $designerId: ID, $status: String) {
		getOrders(clientId: $clientId, designerId: $designerId, status: $status) {
			id
			status
			poNumber
			itemNumber
			description
			quantity
			createdAt
			acceptedAt
			shippedAt
			deliveredAt
			damagedAt
			shipper
			carrier
			client {
				id
				name
			}
			designer {
				id
				name
			}
			items {
				id
				name
				qrCode
				location
				currentStatus
				category {
					id
					name
				}
				imagesByStatus
				pieces {
					name
					status
					note
					location
					imagesByStatus
				}
			}
		}
	}
`;
