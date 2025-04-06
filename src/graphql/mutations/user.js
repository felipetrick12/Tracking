import { gql } from '@apollo/client';

export const CREATE_USER = gql`
	mutation CreateUser(
		$name: String!
		$email: String!
		$password: String!
		$address: String
		$phone: String
		$role: String!
		$activeOrganization: ID
		$assignedTo: ID
		$photoUrl: String # ✅ Accept image as Base64
	) {
		createUser(
			name: $name
			email: $email
			password: $password
			role: $role
			address: $address
			phone: $phone
			activeOrganization: $activeOrganization
			assignedTo: $assignedTo
			photoUrl: $photoUrl # ✅ Send image
		) {
			id
			name
			email
			role
			photoUrl # ✅ Get uploaded image URL
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

export const UPDATE_USER = gql`
	mutation UpdateUser(
		$id: ID!
		$name: String
		$role: String
		$assignedTo: ID
		$activeOrganization: ID
		$photoUrl: String # ✅ Allow updating profile image
		$address: String
		$phone: String
	) {
		updateUser(
			id: $id
			name: $name
			role: $role
			assignedTo: $assignedTo
			activeOrganization: $activeOrganization
			photoUrl: $photoUrl # ✅ Send new image URL
			address: $address
			phone: $phone
		) {
			id
			name
			role
			photoUrl # ✅ Return updated image URL
			phone
			address
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
