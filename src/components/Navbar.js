'use client';

import UserDropdown from './UserDropdown';

const Navbar = () => {
	return (
		<header className="w-full px-6 py-4 bg-white shadow-md flex justify-between items-center border-b border-gray-300">
			{/* ✅ Left Side: App Name */}
			<h1 className="text-lg font-bold text-black">Dashboard</h1>

			{/* ✅ Right Side: User Profile Dropdown */}
			<UserDropdown />
		</header>
	);
};

export default Navbar;
