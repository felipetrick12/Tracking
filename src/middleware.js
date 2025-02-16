import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/register'];

export default function middleware(req) {
	// ✅ Leer el token desde las cookies
	const token = req.cookies.get('token')?.value || null;
	console.log('🔍 Checking route:', req.nextUrl.pathname);
	console.log('🔑 Token:', token ? 'Exists' : 'Not Found');

	// 🚀 Si el usuario tiene token, evitar que entre a login o register
	if (token && publicRoutes.includes(req.nextUrl.pathname)) {
		console.log('✅ User is authenticated, redirecting to /dashboard');
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	// 🚀 Si el usuario NO tiene token y quiere acceder a rutas protegidas
	if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
		console.log('❌ User is not authenticated, redirecting to /');
		return NextResponse.redirect(new URL('/', req.url));
	}

	// ✅ Si todo está bien, continuar con la petición
	return NextResponse.next();
}

// ✅ Aplicar middleware en rutas relevantes
export const config = {
	matcher: ['/dashboard', '/', '/register']
};
