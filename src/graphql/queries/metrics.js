import { gql } from '@apollo/client';

// 🚀 Query para Admin
export const GET_ADMIN_METRICS = gql`
	query GetAdminMetrics {
		getAdminMetrics {
			totalUsers
			totalOrders
			ordersInProgress
		}
	}
`;

// 🚀 Query para Cliente (ahora ya no requiere userId porque se obtiene desde el backend)
export const GET_CLIENT_METRICS = gql`
	query GetClientMetrics {
		getClientMetrics {
			totalClients
			totalOrders
		}
	}
`;
