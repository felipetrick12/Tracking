import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
	query GetOrganizations {
		getOrganizations {
			id
			name
			address
			city
			state
			zipCode
			phone
		}
	}
`;
