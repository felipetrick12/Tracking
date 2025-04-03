import { gql } from '@apollo/client';

// Create order for a designer
export const CREATE_ORDER = gql`
	mutation CreateOrderDesigner(
		$designer: ID!
		$client: ID!
		$description: String
		$category: ID!
		$quantity: Int!
		$pieces: [PieceInput!]
		$carrier: ID
		$shipper: ID
		$itemNumber: String
		$poNumber: String
		$orderType: String
		$deliveryAddress: String
		$warehouseAddress: String
		$status: String
		$imagesByStatus: ImagesByStatusInput
	) {
		createOrderDesigner(
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
			_id
			description
			quantity
			orderType
			status
			designer {
				_id
				name
			}
			client {
				_id
				name
			}
			category {
				_id
				name
			}
			createdAt
		}
	}
`;

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
