import { ProfileMenuTab } from 'profile/components';
import { PROFILE_MENUS } from 'profile/constants';

export const ProfileContainer = (): JSX.Element => {
    return (
        <div className="flex justify-center w-full h-screen px-4 pt-24">
            <div className="flex flex-col w-full gap-2 md:w-1/2 lg:w-1/4">
                {PROFILE_MENUS.map(({ Icon, ...props }, index) => (
                    <ProfileMenuTab
                        key={index}
                        {...props}
                        icon={<Icon size={24} />}
                    />
                ))}
            </div>
        </div>
    );
};
