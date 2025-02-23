import { GET_ME } from '@/graphql/queries/auth';
import { executeGraphQL } from '@/lib/apolloServer';
import { NextResponse } from 'next/server';

const roleProtectedRoutes = {
	admin: ['/dashboard', '/clients', '/users', '/organizations', '/permissions'],
	designer: ['/dashboard', '/orders', '/settings'],
	user: ['/dashboard']
};

const publicRoutes = ['/', '/register']; // Public pages

export default async function middleware(req) {
	const token = req.cookies.get('token')?.value || null;
	console.log('🔍 Checking route:', req.nextUrl.pathname);
	console.log('🔑 Token:', token ? 'Exists' : 'Not Found');

	// ✅ Allow public routes if user is NOT logged in
	if (!token && publicRoutes.includes(req.nextUrl.pathname)) {
		console.log('✅ Public route, access granted:', req.nextUrl.pathname);
		return NextResponse.next();
	}

	// 🚀 If no token and trying to access a protected route, redirect to login
	if (!token) {
		console.log('❌ No token, redirecting to home');
		const response = NextResponse.redirect(new URL('/', req.url));
		response.cookies.delete('token'); // 🔥 Remove old token
		response.cookies.delete('allowedRoutes'); // 🔥 Remove old routes
		return response;
	}

	try {
		// 🔥 Fetch user data from GraphQL
		const { data } = await executeGraphQL(GET_ME, {}, token);

		if (!data?.me) {
			console.log('❌ User not found, clearing token and redirecting to login');
			const response = NextResponse.redirect(new URL('/', req.url));
			response.cookies.delete('token');
			response.cookies.delete('allowedRoutes');
			return response;
		}

		const role = data.me.role || 'user';

		// 🚀 Get allowed routes based on role
		const allowedRoutes = roleProtectedRoutes[role] || [];

		// ✅ Store token for client-side access (Apollo Client)
		const response = NextResponse.next();
		response.cookies.set('token', token, {
			httpOnly: false, // ✅ Allow client-side access
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		});

		// ✅ Store allowed routes in a cookie (JSON stringified)
		response.cookies.set('allowedRoutes', JSON.stringify(allowedRoutes), {
			path: '/',
			httpOnly: false, // ✅ Allow client-side access
			sameSite: 'lax'
		});

		// ✅ Redirect users from login page if already authenticated
		if (req.nextUrl.pathname === '/') {
			console.log('🔄 User is authenticated but on login page. Redirecting to dashboard.');
			return NextResponse.redirect(new URL('/dashboard', req.url));
		}

		console.log('✅ Allowed routes stored in cookie:', allowedRoutes);
		return response;
	} catch (error) {
		console.error('⚠️ Error validating user:', error);
		return NextResponse.redirect(new URL('/', req.url));
	}
}

// ✅ Apply middleware to relevant routes
export const config = {
	matcher: ['/dashboard', '/clients', '/users', '/organizations', '/orders', '/settings', '/permissions', '/']
};
