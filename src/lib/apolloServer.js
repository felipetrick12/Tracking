import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const getGraphQLEndpoint = () => {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:4000/graphql';
	}
	return process.env.REACT_APP_API_URL;
};

export const executeGraphQL = async (queryOrMutation, variables = {}, token = '', isMutation = false) => {
	try {
		const client = new ApolloClient({
			link: new HttpLink({
				uri: getGraphQLEndpoint(),
				credentials: 'include',
				headers: {
					'Authorization': token ? `Bearer ${token}` : '',
					'Content-Type': 'application/json'
				}
			}),
			cache: new InMemoryCache()
		});

		const response = isMutation
			? await client.mutate({ mutation: queryOrMutation, variables })
			: await client.query({ query: queryOrMutation, variables });

		return { data: response.data };
	} catch (error) {
		console.error('❌ executeGraphQL error:', error.message);
		return { error };
	}
};
