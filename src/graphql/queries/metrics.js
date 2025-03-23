import { gql } from '@apollo/client';

// 🚀 Query para Superadmin
export const GET_SUPERADMIN_METRICS = gql`
	query GetSuperAdminMetrics {
		getSuperAdminMetrics {
			totalUsers
			totalOrders
			ordersInProgress
		}
	}
`;

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

// 🚀 Query para Designer
export const GET_DESIGNER_METRICS = gql`
	query GetDesignerMetrics {
		getDesignerMetrics {
			totalClients
			totalOrders
		}
	}
`;

// 🚀 Query para User (cliente asignado a un diseñador)
export const GET_USER_METRICS = gql`
	query GetUserMetrics {
		getUserMetrics {
			totalOrders
		}
	}
`;
