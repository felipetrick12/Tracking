'use client';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const UserDropdown = ({ user, onLogout }) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<MenuButton className="flex items-center bg-white rounded-md hover:bg-gray-100 focus:outline-none gap-2">
					<img src="https://i.pravatar.cc/60" alt="User Profile" className="w-10 h-10 rounded-full" />
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
								<button
									onClick={onLogout}
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
