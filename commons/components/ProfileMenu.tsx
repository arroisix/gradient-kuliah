import { useAuth } from 'authentication/contexts/AuthProvider';
import { DropdownMenu } from 'radix-ui';
import UserAvatar from './modules/Navbar/components/UserAvatar';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from 'commons/utils';
import { ProfileMenuContent } from './Layout/ProfileMenuContent';

function ProfileMenu(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const { profile } = useAuth();

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger className="bg-[#222222] py-3 px-4 rounded-lg border border-[#333333] flex justify-between items-center gap-3 w-full focus:outline-none">
                <div className="min-w-0 flex items-center gap-3">
                    <UserAvatar profile={profile} />
                    <span className="text-white font-semibold leading-[140%] truncate">
                        {profile?.username}
                    </span>
                </div>

                <ChevronDownIcon
                    className={cn(
                        'shrink-0 text-white w-4 h-4 transition-all',
                        isOpen ? '-rotate-180' : ''
                    )}
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content loop side="top" sideOffset={8}>
                    <ProfileMenuContent />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export { ProfileMenu };
