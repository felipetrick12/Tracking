'use client';

import { makeClient } from '@/app/ApolloConfig';
import { ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';

export function ApolloWrapper({ children }) {
	const [client, setClient] = useState(null);

	// ✅ Load Apollo Client on mount
	useEffect(() => {
		const apolloClient = makeClient();

		setClient(apolloClient);
	}, []);

	if (!client) return <p>Loading...</p>; // 🔥 Wait to get the client

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
