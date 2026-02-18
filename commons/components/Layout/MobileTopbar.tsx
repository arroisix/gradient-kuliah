import { cn } from 'commons/utils';
import UserAvatar from '../modules/Navbar/components/UserAvatar';
import { useAuth } from 'authentication/contexts/AuthProvider';
import RoleSwitcher from '../modules/Navbar/RoleSwitcher';
import { useState } from 'react';
import { DropdownMenu } from 'radix-ui';
import { ProfileMenuContent } from './ProfileMenuContent';

function MobileTopbar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const { profile } = useAuth();

    return (
        <div
            className={cn(
                'flex justify-between items-center py-3 px-4',
                'lg:hidden'
            )}>
            <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu.Trigger>
                    <UserAvatar profile={profile} />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content loop side="bottom" sideOffset={12}>
                        <ProfileMenuContent />
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <RoleSwitcher />
        </div>
    );
}

export { MobileTopbar };
