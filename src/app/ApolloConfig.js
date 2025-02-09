'use client';
// ^ this file needs the "use client" pragma

import { HttpLink } from '@apollo/client';
import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from '@apollo/experimental-nextjs-app-support';

// have a function to create a client for you
function makeClient() {
	// Validate if the token is valid and not expired
	const httpLink = new HttpLink({
		uri: 'http://localhost:4000/graphql',
		credentials: 'include',
		headers: {
			authorization: typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token')}` : ''
		}
	});

	// use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
	return new ApolloClient({
		// use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
		cache: new InMemoryCache(),
		link: httpLink
	});
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }) {
	return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
