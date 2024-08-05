import { cn, renderName } from 'commons/utils';
import React, { useContext } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import UserAvatar from './UserAvatar';
import UserProfileDropdown from './UserProfileDropdown';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import AuthContext from 'authentication/contexts/AuthProvider';
import { useTracker } from 'tracker/tracker';

const UserProfile = (): JSX.Element => {
    const tracker = useTracker();
    const user = useSelector(getCurrentUser);
    const { profile } = useContext(AuthContext);

    const { theme } = useThemeContext();
    const lightMode = theme === 'light';

    return (
        <div className="dropdown dropdown-end">
            <button
                type="button"
                tabIndex={0}
                className={cn('flex items-center gap-2 hover:text-accent-blue')}
                onClick={() =>
                    tracker?.genericTrack('Click/Hover Profile Name')
                }>
                <UserAvatar profile={profile} />
                <div className="flex items-center">
                    <span>{renderName(user.email, user.full_name)}</span>
                    <MdArrowDropDown />
                </div>
            </button>
            <ul
                role="menubar"
                tabIndex={0}
                className={cn(
                    'dropdown-content mt-4 p-2 w-48 menu shadow-md rounded-lg border',
                    lightMode
                        ? 'bg-white text-black'
                        : 'bg-graphite-900 border-graphite-600/50 text-white'
                )}>
                <UserProfileDropdown />
            </ul>
        </div>
    );
};

export default UserProfile;
