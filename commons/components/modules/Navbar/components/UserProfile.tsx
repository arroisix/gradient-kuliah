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
import { createPortal } from 'react-dom';
import { useWindowSize } from 'usehooks-ts';

const UserProfile = (): JSX.Element => {
    const tracker = useTracker();
    const user = useSelector(getCurrentUser);
    const { profile } = useContext(AuthContext);
    const { width } = useWindowSize();

    const { theme } = useThemeContext();
    const lightMode = theme === 'light';

    const [isOpen, setIsOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                className={cn('flex items-center gap-2 hover:text-accent-blue')}
                onClick={() => {
                    setIsOpen(!isOpen);
                    tracker?.genericTrack('Click/Hover Profile Name');
                }}>
                <UserAvatar profile={profile} />
                <div className="flex items-center">
                    <span>{renderName(user.email, user.full_name)}</span>
                    <MdArrowDropDown />
                </div>
            </button>
            {isOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        aria-hidden
                        className={cn(
                            'fixed rounded-lg border text-sm font-medium shadow-md',
                            lightMode
                                ? 'bg-white text-black'
                                : 'bg-graphite-900 border-graphite-600/50 text-white'
                        )}
                        style={{
                            zIndex: width < 768 ? 99999 : 9999,
                            top: buttonRef.current
                                ? buttonRef.current.getBoundingClientRect()
                                      .bottom + 16
                                : 'auto',
                            right:
                                width < 768
                                    ? 0
                                    : buttonRef.current
                                    ? window.innerWidth -
                                      buttonRef.current.getBoundingClientRect()
                                          .right -
                                      16
                                    : 'auto',
                            minWidth: '200px'
                        }}
                        onClick={() => setIsOpen(false)}>
                        <ul role="menubar" className="p-2 w-max menu">
                            <UserProfileDropdown />
                        </ul>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default UserProfile;
