'use client';
import { useAuth } from '@/context/AuthProvider';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ArrowRightCircleIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const UserDropdown = () => {
	const { logout, auth } = useAuth();

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<MenuButton className="flex items-center gap-2 p-2 bg-white border rounded-md shadow-md hover:bg-gray-100 focus:outline-none">
					<img src="https://i.pravatar.cc/60" alt="User Profile" className="w-10 h-10 rounded-full" />
					<span className="text-sm font-medium text-gray-900 hidden md:block">
						{auth?.user?.name || 'User'}
					</span>
				</MenuButton>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute right-0 z-10 mt-2 w-48 bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
					<div className="py-1">
						<MenuItem>
							{({ active }) => (
								<a
									href="/settings"
									className={`flex items-center px-4 py-2 text-sm ${
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
									}`}
								>
									<Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500" />
									Settings
								</a>
							)}
						</MenuItem>
						<MenuItem>
							{({ active }) => (
								<a
									href="/profile"
									className={`flex items-center px-4 py-2 text-sm ${
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
									}`}
								>
									<UserIcon className="w-5 h-5 mr-2 text-gray-500" />
									Profile
								</a>
							)}
						</MenuItem>
					</div>
					<div className="py-1">
						<MenuItem>
							{({ active }) => (
								<button
									onClick={logout} // Replace with actual logout function
									className={`w-full flex items-center px-4 py-2 text-sm ${
										active ? 'bg-red-100 text-red-600' : 'text-red-500'
									}`}
								>
									<ArrowRightCircleIcon className="w-5 h-5 mr-2" />
									Logout
								</button>
							)}
						</MenuItem>
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	);
};

export default UserDropdown;
