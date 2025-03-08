import { ApolloClient, HttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { parseCookies } from 'nookies';

export const userVar = makeVar(null); // ✅ Variable reactiva global

const getClientToken = () => {
	const cookies = parseCookies();
	return cookies['token'] || '';
};

const getUserFromCookies = () => {
	const cookies = parseCookies();
	return cookies['userData'] ? JSON.parse(cookies['userData']) : null;
};

export function makeClient() {
	const token = getClientToken();
	const userData = getUserFromCookies();

	console.log('🔑 Token:', token);
	console.log('👤 User:', userData);

	if (userData) {
		userVar(userData); // ✅ Save user in global reactive variable
	}

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
