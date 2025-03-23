import { gql } from '@apollo/client';

export const GET_ME = gql`
	query Me {
		me {
			id
			name
			email
			role
			photoUrl
			activeOrganization {
				id
				name
			}
		}
	}
`;
