import {
	ClipboardIcon,
	Cog6ToothIcon,
	HomeIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UserIcon
} from '@heroicons/react/24/outline';

// 🔹 Definir todas las rutas con los roles permitidos
export const ROUTES = [
	{
		path: '/dashboard',
		label: 'Dashboard',
		icon: <HomeIcon className="w-5 h-5" />,
		roles: ['admin', 'designer', 'user']
	},
	{ path: '/clients', label: 'Clients', icon: <UserGroupIcon className="w-5 h-5" />, roles: ['admin'] },
	{ path: '/settings', label: 'Settings', icon: <Cog6ToothIcon className="w-5 h-5" />, roles: ['admin', 'designer'] },
	{ path: '/orders', label: 'Orders', icon: <ClipboardIcon className="w-5 h-5" />, roles: ['designer'] },
	{ path: '/users', label: 'Manage Users', icon: <UserIcon className="w-5 h-5" />, roles: ['admin'] },
	{ path: '/permissions', label: 'Permissions', icon: <ShieldCheckIcon className="w-5 h-5" />, roles: ['admin'] }
];

// 🔹 Rutas públicas accesibles sin autenticación
export const PUBLIC_ROUTES = ['/', '/register'];

// 🔹 Rutas protegidas (requieren autenticación)
export const PROTECTED_ROUTES = ROUTES.map((route) => route.path);
