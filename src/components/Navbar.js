'use client';

import UserDropdown from './UserDropdown';

const Navbar = () => {
	return (
		<header className="w-full px-6 py-4 bg-gray-900 shadow-md flex justify-between items-center">
			{/* ✅ Left Side: App Name */}
			<h1 className="text-lg font-bold text-white">Dashboard</h1>

			{/* ✅ Right Side: User Profile Dropdown */}
			<UserDropdown />
		</header>
	);
};

export default Navbar;
