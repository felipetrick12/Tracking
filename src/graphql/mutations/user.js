import { gql } from '@apollo/client';

export const CREATE_USER = gql`
	mutation CreateUser(
		$name: String!
		$email: String!
		$password: String!
		$role: String!
		$activeOrganization: ID
		$assignedTo: ID
	) {
		createUser(
			name: $name
			email: $email
			password: $password
			role: $role
			activeOrganization: $activeOrganization
			assignedTo: $assignedTo
		) {
			id
			name
			email
			role
			activeOrganization {
				id
				name
			}
			assignedTo {
				id
				name
			}
		}
	}
`;

// ✅ Update User
export const UPDATE_USER = gql`
	mutation UpdateUser($id: ID!, $name: String, $role: String, $assignedTo: ID, $activeOrganization: ID) {
		updateUser(
			id: $id
			name: $name
			role: $role
			assignedTo: $assignedTo
			activeOrganization: $activeOrganization
		) {
			id
			name
			role
			assignedTo {
				id
				name
			}
			organizations {
				id
				name
			}
		}
	}
`;
