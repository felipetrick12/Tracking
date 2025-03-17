import { gql } from '@apollo/client';

// ✅ Obtener TODAS las órdenes
export const GET_ALL_ORDERS = gql`
	query GetOrders {
		getOrders {
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
			deliveryAddress
			warehouseAddress
			images
			createdAt
			updatedAt
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
			images
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
			images
			createdAt
			updatedAt
		}
	}
`;
