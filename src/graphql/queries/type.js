import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
	query GetCategories {
		getTypes(type: "order") {
			id
			name
		}
	}
`;
