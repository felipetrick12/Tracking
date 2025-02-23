import { CREATE_DESIGNER } from '@/graphql/mutations';
import { executeGraphQL } from '@/lib/apolloServer';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	const session = await getSession({ req });
	if (!session || session.user.role !== 'ADMIN') {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		const { name, email, password } = req.body;
		const organizationId = session.user.activeOrganization; // Assign to same org as admin

		const response = await executeGraphQL(CREATE_DESIGNER, {
			input: {
				name,
				email,
				password,
				organizationId
			}
		});

		res.status(200).json(response.data.createDesigner);
	} catch (error) {
		console.error('Error creating designer:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}
