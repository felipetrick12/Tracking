'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowRightCircleIcon } from 'lucide-react';

const UserDropdown = ({ user, onLogout }) => {
	const username = user?.name || 'User';
	const userPhoto = user?.photoUrl || 'https://i.pravatar.cc/60';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center cursor-pointer gap-2">
					<Avatar>
						<AvatarImage src={userPhoto} alt={username} />
					</Avatar>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem onClick={onLogout} className="text-red-500 focus:bg-red-100 focus:text-red-600">
					<ArrowRightCircleIcon className="w-4 h-4 mr-2" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
