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

// 🧠 Detect environment (development vs production)
const getGraphQLEndpoint = () => {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:4000/graphql'; // ✅ local backend
	}

	// 👇 para producción, usa la variable del entorno
	return process.env.REACT_APP_API_URL;
};

export function makeClient() {
	const token = getClientToken();
	const userData = getUserFromCookies();

	if (userData) {
		userVar(userData);
	}

	const httpLink = new HttpLink({
		uri: getGraphQLEndpoint(),
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
