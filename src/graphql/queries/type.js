import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
	query GetCategories {
		getTypes(type: "order") {
			id
			name
		}
	}
`;

export const CREATE_TYPE = gql`
	mutation CreateType($type: String!, $name: String!, $description: String) {
		createType(type: $type, name: $name, description: $description) {
			id
			type
			name
			description
			createdAt
		}
	}
`;
