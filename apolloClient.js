import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, // Ensure correct API endpoint
	credentials: 'include' // 🔥 Send cookies with every request
});

const authLink = setContext((_, { headers }) => {
	const token = document.cookie
		.split('; ')
		.find((row) => row.startsWith('token='))
		?.split('=')[1];

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});

export default client;
