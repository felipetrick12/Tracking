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
			description
			category {
				id
				name
			}
			quantity
			status
		}
	}
`;
