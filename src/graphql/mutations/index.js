import { gql } from '@apollo/client';

//Auth mutations
export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				name
				email
				role
			}
		}
	}
`;
