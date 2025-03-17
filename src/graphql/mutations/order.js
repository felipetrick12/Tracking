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
		$orderType: String!
		$deliveryAddress: String
		$warehouseAddress: String
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
		) {
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
			status
		}
	}
`;

// ✅ Actualizar una orden existente
export const UPDATE_ORDER = gql`
	mutation UpdateOrder($orderId: ID!, $status: String!) {
		updateOrderStatus(orderId: $orderId, status: $status) {
			id
			status
		}
	}
`;
