import jwtDecode from 'jwt-decode';

export const isTokenValid = (token) => {
	if (!token) return false;

	try {
		const decoded = jwtDecode(token);
		const currentTime = Date.now() / 1000; // Convert to seconds
		return decoded.exp > currentTime; // Check if token is expired
	} catch (error) {
		return false;
	}
};
