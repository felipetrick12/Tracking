import { gql } from '@apollo/client';

// ✅ Obtener TODAS las órdenes
export const GET_ALL_ORDERS = gql`
	query GetOrders($clientId: ID, $designerId: ID, $status: String) {
		getOrders(clientId: $clientId, designerId: $designerId, status: $status) {
			id
			receivedOn
			status
			description
			quantity
			pieces {
				name
				quantity
			}
			carrier
			shipper
			itemNumber
			poNumber
			orderType
			deliveryAddress
			warehouseAddress
			imagesByStatus
			createdAt
			updatedAt
			designer {
				id
				name
			}
			client {
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

export const GET_CLIENTS_BY_DESIGNER = gql`
	query GetClientsByDesigner($designerId: ID!) {
		getClientsByDesigner(designerId: $designerId) {
			id
			name
			email
			photoUrl
		}
	}
`;

// ✅ Obtener órdenes asignadas a un Diseñador específico
export const GET_ORDERS_BY_DESIGNER = gql`
	query GetOrdersByDesigner($designerId: ID!) {
		getOrdersByDesigner(designerId: $designerId) {
			id
			receivedOn
			client {
				id
				name
			}
			description
			category {
				id
				name
			}
			quantity
			status
			orderType
			createdAt
			updatedAt
		}
	}
`;

export const GET_ORDERS_BY_CLIENT = gql`
	query GetOrdersByClient($clientId: ID!) {
		getOrdersByClient(clientId: $clientId) {
			id
			receivedOn
			description
			category {
				id
				name
			}
			quantity
			status
			orderType
			createdAt
			updatedAt
		}
	}
`;

// ✅ Obtener órdenes asociadas a una Organización
export const GET_ORDERS_BY_ORGANIZATION = gql`
	query GetOrdersByOrganization($organizationId: ID!) {
		getOrdersByOrganization(organizationId: $organizationId) {
			id
			receivedOn
			designer {
				id
				name
			}
			client {
				id
				name
			}
			description
			category {
				id
				name
			}
			quantity
			status
			orderType
			createdAt
			updatedAt
		}
	}
`;

export const GET_ORDER_IMAGES = gql`
	query GetOrderImages($orderId: ID!) {
		getOrderImages(id: $orderId) {
			pending
			received
			shipped
			damaged
		}
	}
`;
