import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const executeGraphQL = async (query, variables = {}, token = '') => {
	try {
		// 🚀 Config client apollo
		const client = new ApolloClient({
			link: new HttpLink({
				uri: 'http://localhost:4000/graphql',
				headers: {
					'Authorization': token ? `Bearer ${token}` : '',
					'Content-Type': 'application/json'
				}
			}),
			cache: new InMemoryCache()
		});

		// 🚀 Execute  query/mutation
		const { data } = await client.query({
			query,
			variables
		});

		return { data };
	} catch (error) {
		console.error('❌ Error in executeGraphQL:', error);
		return { error };
	}
};
