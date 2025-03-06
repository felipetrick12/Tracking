import { gql } from '@apollo/client';

// ✅ Get Users
export const GET_USERS = gql`
	query GetUsers {
		getUsers {
			id
			name
			email
			role
			organizations {
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

// ✅ Get Available Roles from Types
export const GET_ROLES = gql`
	query GetRoles {
		getTypes(type: "roles") {
			id
			name
		}
	}
`;

//✅ Get Designers
export const GET_DESIGNERS = gql`
	query GetUsersByRole($role: String!) {
		getUsersByRole(role: $role) {
			id
			name
		}
	}
`;

//✅ Get User by Role
export const GET_USERS_BY_ROLE = gql`
	query GetUsersByRole($role: String!, $organizationId: ID!) {
		getUsersByRole(role: $role, organizationId: $organizationId) {
			name
			lastLogin
			id
		}
	}
`;
