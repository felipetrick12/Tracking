import { gql } from '@apollo/client';

// ✅ Get Users
export const GET_USERS = gql`
	query GetUsers {
		getUsers {
			id
			name
			email
			role
			photoUrl
			activeOrganization {
				id
				name
			}
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

//✅ Get Clients assigned to Designer
export const GET_CLIENTS_BY_DESIGNER = gql`
	query GetClientsByDesigner($designerId: ID!) {
		getClientsByDesigner(designerId: $designerId) {
			id
			name
		}
	}
`;

//✅ Get User by Role
export const GET_USERS_BY_ROLE = gql`
	query GetUsersByRole($role: String!, $organizationId: ID) {
		getUsersByRole(role: $role, organizationId: $organizationId) {
			id
			name
			lastLogin
			organizations {
				id
				name
			}
		}
	}
`;

//Designer CLients
export const GET_MY_CLIENTS = gql`
	query GetMyClients {
		getMyClients {
			id
			name
			email
			assignedTo {
				id
			}
		}
	}
`;
