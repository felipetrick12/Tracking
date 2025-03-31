import { GET_ME } from '@/graphql/queries/auth';
import { executeGraphQL } from '@/lib/apolloServer';
import { NextResponse } from 'next/server';

const roleProtectedRoutes = {
	superadmin: ['/dashboard', '/users', '/organizations', '/orders', '/inventory'],
	admin: ['/dashboard', '/users', '/orders'],
	designer: ['/dashboard', '/clients'],
	client: ['/dashboard', '/clients']
};

const publicRoutes = ['/', '/register'];

export default async function middleware(req) {
	const token = req.cookies.get('token')?.value || null;
	console.log('🔍 Checking route:', req.nextUrl.pathname);
	console.log('🔑 Token:', token ? 'Exists' : 'Not Found');

	// ✅ Permitir rutas públicas
	if (!token && publicRoutes.includes(req.nextUrl.pathname)) {
		console.log('✅ Public route, access granted');
		return NextResponse.next();
	}

	// ❌ Sin token en ruta protegida, redirige a home
	if (!token) {
		console.log('⛔ No token, redirecting');
		const response = NextResponse.redirect(new URL('/', req.url));
		response.cookies.delete('token');
		response.cookies.delete('allowedRoutes');
		return response;
	}

	try {
		const { data } = await executeGraphQL(GET_ME, {}, token);

		if (!data?.me) {
			console.log('❌ Token inválido, borrando cookies');
			const response = NextResponse.redirect(new URL('/', req.url));
			response.cookies.delete('token');
			response.cookies.delete('userData');
			response.cookies.delete('allowedRoutes');
			return response;
		}

		const role = data.me.role || 'user';
		const allowedRoutes = roleProtectedRoutes[role] || [];

		const response = NextResponse.next();

		// 🍪 Cookies visibles para el cliente
		response.cookies.set('token', token, {
			httpOnly: false,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		});

		response.cookies.set('userData', JSON.stringify(data.me), {
			httpOnly: false,
			sameSite: 'lax',
			path: '/'
		});

		response.cookies.set('allowedRoutes', JSON.stringify(allowedRoutes), {
			httpOnly: false,
			sameSite: 'lax',
			path: '/'
		});

		// Si está en login ("/") y ya está logueado, redirigir a dashboard
		if (req.nextUrl.pathname === '/') {
			return NextResponse.redirect(new URL('/dashboard', req.url));
		}

		return response;
	} catch (error) {
		console.error('⚠️ Middleware error:', error);
		return NextResponse.redirect(new URL('/', req.url));
	}
}

export const config = {
	matcher: ['/dashboard', '/clients', '/users', '/organizations', '/orders', '/settings', '/permissions', '/']
};
