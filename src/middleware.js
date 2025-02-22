import { GET_ME } from '@/graphql/queries/auth';
import { executeGraphQL } from '@/lib/apolloServer';
import { NextResponse } from 'next/server';

const roleProtectedRoutes = {
	admin: ['/dashboard', '/clients', '/settings', '/users', '/permissions'],
	designer: ['/dashboard', '/orders', '/settings'],
	user: ['/dashboard']
};

const publicRoutes = ['/', '/register'];

export default async function middleware(req) {
	const token = req.cookies.get('token')?.value || null;
	console.log('🔍 Checking route:', req.nextUrl.pathname);
	console.log('🔑 Token:', token ? 'Exists' : 'Not Found');

	// ✅ Allow public routes without authentication
	if (publicRoutes.includes(req.nextUrl.pathname)) {
		console.log('✅ Public route, access granted:', req.nextUrl.pathname);
		return NextResponse.next();
	}

	// 🚀 If no token and trying to access a protected route, redirect to login
	if (!token) {
		console.log('❌ No token, redirecting to home');
		return NextResponse.redirect(new URL('/', req.url));
	}

	try {
		// 🔥 Fetch user data from GraphQL
		const { data } = await executeGraphQL(GET_ME, {}, token);

		if (!data?.me) {
			console.log('❌ User not found, clearing token and redirecting to login');
			const response = NextResponse.redirect(new URL('/', req.url));
			response.cookies.delete('token'); // 🔥 Remove invalid token
			return response;
		}

		const role = data.me.role || 'user';

		// 🚀 Get allowed routes based on role
		const allowedRoutes = roleProtectedRoutes[role] || [];

		// ✅ Store allowed routes in a cookie (JSON stringified)
		const response = NextResponse.next();
		response.cookies.set('allowedRoutes', JSON.stringify(allowedRoutes), { path: '/' });

		console.log('✅ Allowed routes stored in cookie:', allowedRoutes);
		return response;
	} catch (error) {
		console.error('⚠️ Error validating user:', error);
		return NextResponse.redirect(new URL('/', req.url));
	}
}

// ✅ Apply middleware to relevant routes
export const config = {
	matcher: ['/dashboard', '/clients', '/settings', '/orders', '/users', '/permissions']
};
