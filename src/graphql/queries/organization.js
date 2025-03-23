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
			createdBy {
				id
				name
			}
		}
	}
`;

// ✅ GraphQL Mutation
export const CREATE_ORGANIZATION = gql`
	mutation CreateOrganization(
		$name: String!
		$address: String
		$city: String
		$state: String
		$zipCode: String
		$phone: String
		$notes: String
		$admins: [ID]
	) {
		createOrganization(
			name: $name
			address: $address
			city: $city
			state: $state
			zipCode: $zipCode
			phone: $phone
			notes: $notes
			admins: $admins
		) {
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
