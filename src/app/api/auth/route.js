import { GET_ME } from '@/graphql/queries/auth';
import { executeGraphQL } from '@/lib/apolloServer';
import { NextResponse } from 'next/server';

export async function GET(req) {
	// 🔥 Obtener el token desde las cookies
	const token = req.cookies.get('token')?.value;

	if (!token) {
		return NextResponse.json({ error: 'No token found' }, { status: 401 });
	}

	try {
		// 🔥 Ejecutar la consulta GET_ME en Apollo Server
		const { data } = await executeGraphQL(GET_ME, {}, token);

		if (!data?.me) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({ user: data.me });
	} catch (error) {
		return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
	}
}
