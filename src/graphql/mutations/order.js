import { gql } from '@apollo/client';

// ✅ Crear nueva orden
export const CREATE_ORDER = gql`
	mutation CreateOrder($input: OrderInput!) {
		createOrder(input: $input) {
			id
			receivedOn
			status
			description
			designer {
				id
				name
			}
			client {
				id
				name
			}
		}
	}
`;

export const CREATE_ORDER_CLIENT = gql`
	mutation CreateOrder($input: OrderInput!) {
		createOrder(input: $input) {
			id
			receivedOn
			status
			description
			designer {
				id
				name
			}
			client {
				id
				name
			}
		}
	}
`;

// ✅ Actualizar una orden existente
export const UPDATE_ORDER = gql`
	mutation UpdateOrder($orderId: ID!, $input: OrderInput) {
		updateOrder(orderId: $orderId, input: $input) {
			id
			status
			description
			quantity
			orderType
			deliveryAddress
			warehouseAddress
			pieces {
				name
				quantity
			}
			carrier
			shipper
			itemNumber
			poNumber
			imagesByStatus
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
			createdAt
			updatedAt
		}
	}
`;
