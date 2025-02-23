'use client';

import { HttpLink } from '@apollo/client';
import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { parseCookies } from 'nookies';

// ✅ Function to extract token from cookies (Works in both client & server)
const getClientToken = () => {
	const cookies = parseCookies();

	console.log('cookies', cookies);

	return cookies['token'] || '';
};

// ✅ Function to create Apollo Client
function makeClient() {
	const token = getClientToken(); // 🔥 Fetch token correctly

	console.log('Token in makeClient:', token); // Debugging

	const httpLink = new HttpLink({
		uri: 'http://localhost:4000/graphql',
		credentials: 'include',
		headers: {
			Authorization: token ? `Bearer ${token}` : ''
		}
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink
	});
}

// ✅ Apollo Provider Wrapper
export function ApolloWrapper({ children }) {
	return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
