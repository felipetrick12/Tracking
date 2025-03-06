import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
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
		}
	}
`;

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
		}
	}
`;

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
		}
	}
`;
