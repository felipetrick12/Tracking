import { gql } from '@apollo/client';

// ✅ Crear nueva orden (Admin/Diseñador)
export const CREATE_ORDER = gql`
	mutation CreateOrder($input: OrderInput!) {
		createOrder(input: $input) {
			id
			status
			description
			quantity
			poNumber
			itemNumber
			createdAt
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

// ✅ Crear orden como cliente (respuesta más simple)
export const CREATE_ORDER_CLIENT = gql`
	mutation CreateOrder($input: OrderInput!) {
		createOrder(input: $input) {
			id
			status
			description
			createdAt
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

// ✅ Actualizar orden (se recomienda ajustar tu schema también si vas a usar este input)
export const UPDATE_ORDER = gql`
	mutation UpdateOrder($orderId: ID!, $input: OrderInput) {
		updateOrder(orderId: $orderId, input: $input) {
			id
			status
			description
			quantity
			itemNumber
			poNumber
			carrier
			shipper
			createdAt
			updatedAt
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

export const UPDATE_ORDER_STATUS = gql`
	mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
		updateOrderStatus(orderId: $orderId, status: $status) {
			id
			status
			updatedAt
		}
	}
`;

export const UPDATE_ORDER_AND_INVENTORY = gql`
	mutation UpdateOrderAndInventory($orderId: ID!, $input: UpdateOrderInput!) {
		updateOrderAndInventory(orderId: $orderId, input: $input) {
			id
			status
			updatedAt
			items {
				id
				currentStatus
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
