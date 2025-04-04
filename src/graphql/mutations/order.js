import { gql } from '@apollo/client';

// ✅ Crear nueva orden
export const CREATE_ORDER = gql`
	mutation CreateOrder(
		$designer: ID!
		$client: ID!
		$description: String
		$category: ID!
		$quantity: Int!
		$pieces: [PieceInput]
		$carrier: String
		$shipper: String
		$itemNumber: String
		$poNumber: String
		$orderType: String
		$deliveryAddress: String
		$warehouseAddress: String
		$status: String
		$imagesByStatus: JSON
	) {
		createOrder(
			designer: $designer
			client: $client
			description: $description
			category: $category
			quantity: $quantity
			pieces: $pieces
			carrier: $carrier
			shipper: $shipper
			itemNumber: $itemNumber
			poNumber: $poNumber
			orderType: $orderType
			deliveryAddress: $deliveryAddress
			warehouseAddress: $warehouseAddress
			status: $status
			imagesByStatus: $imagesByStatus
		) {
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
