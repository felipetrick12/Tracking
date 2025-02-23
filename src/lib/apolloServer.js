import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const executeGraphQL = async (queryOrMutation, variables = {}, token = '', isMutation = false) => {
	try {
		// 🚀 Configure Apollo Client
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

		// 🚀 Execute query/mutation
		const { data } = isMutation
			? await client.mutate({ mutation: queryOrMutation, variables })
			: await client.query({ query: queryOrMutation, variables });

		return { data };
	} catch (error) {
		console.error('❌ Error in executeGraphQL:', error);
		return { error };
	}
};
