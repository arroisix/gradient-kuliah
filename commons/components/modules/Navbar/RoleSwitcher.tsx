import { useState, useRef, useEffect, Fragment } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import UTBKLogo from './components/utbk/UTBKLogo';
import { FaCheckCircle } from 'react-icons/fa';
import {
    useGetProfileQuery,
    useUpdateUserMutation
} from 'authentication/redux/api/authApi';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useRouter } from 'next/router';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { Dialog, Transition } from '@headlessui/react';
import CollegeLogo from './components/CollegeLogo';

interface Role {
    id: 'K12' | 'COLLEGE_STUDENT';
    label: string;
    badge?: string | JSX.Element;
    description: string;
}

const roles: Role[] = [
    {
        id: 'K12',
        label: 'Gradient',
        badge: <UTBKLogo variant="small" />,
        description: 'Untuk Persiapan PTN'
    },
    {
        id: 'COLLEGE_STUDENT',
        label: 'Gradient',
        badge: <CollegeLogo variant="small" />,
        description: 'Untuk Mahasiswa'
    }
];

const RoleSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { profile } = useAuth();
    const { data } = useGetProfileQuery({});
    const [selectedRole, setSelectedRole] = useState<Role>();
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const [isNavigating, setIsNavigating] = useState(false);

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data) {
            const currentRole = roles.find(
                (role) => role.id === data.current_role
            );
            setSelectedRole(currentRole);
        }
    }, [data, profile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !isMobileBreakpoints
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileBreakpoints]);

    const handleRoleSelect = async (role: Role) => {
        if (data && role.id !== selectedRole?.id) {
            setIsOpen(false);

            try {
                // Update user role in backend first
                await updateUser({
                    ...data,
                    phone_number: data.phone_number.replace(/\+/g, ''),
                    current_role: role.id
                }).unwrap();

                // Update local state
                setSelectedRole(role);

                // Set navigating state and wait for navigation to complete
                setIsNavigating(true);

                // Navigate to appropriate dashboard and wait for completion
                if (role.id === 'K12') {
                    await router.replace('/utbk/dashboard');
                } else {
                    await router.replace('/dashboard');
                }

                setIsNavigating(false);
            } catch (error) {
                console.error('Failed to update role:', error);
                setIsNavigating(false);
            }
        }
    };

    if (isUpdating || isNavigating) {
        return <LoadingBackdrop />;
    }

    return (
        <>
            <div className="relative w-full" ref={dropdownRef}>
                {/* Label */}
                <div className="text-gray-400 text-xs mb-2 lg:block hidden">
                    Ganti Mode
                </div>

                {/* Selected Role Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center gap-2 lg:bg-[#2C2C2C] lg:hover:bg-[#252525] lg:border border-[#2a2a2a] rounded-lg lg:px-4 lg:py-2.5 transition-colors font-[Urbanist]">
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-white text-lg font-semibold font-[Urbanist]">
                            {selectedRole?.label}
                        </span>
                        {selectedRole?.badge && selectedRole.badge}
                    </div>
                    <FiChevronDown
                        className={`text-gray-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                        size={20}
                    />
                </button>

                {/* Desktop Dropdown Menu */}
                {isOpen && !isMobileBreakpoints && (
                    <div className="hidden lg:block absolute top-full mt-2 w-full bg-[#101010] border border-[#2a2a2a] rounded-lg shadow-xl overflow-hidden z-50">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleSelect(role)}
                                className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                                    selectedRole?.id === role.id
                                        ? 'bg-[#5b4cdb] hover:bg-[#6d5ee5]'
                                        : 'hover:bg-[#252525]'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-start gap-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-white font-semibold font-[Urbanist]">
                                                {role.label}
                                            </span>
                                            {role.badge && role.badge}
                                        </div>
                                        <span
                                            className={`text-sm ${
                                                selectedRole?.id === role.id
                                                    ? 'text-white'
                                                    : 'text-gray-400'
                                            }`}>
                                            {role.description}
                                        </span>
                                    </div>
                                </div>
                                {selectedRole?.id === role.id && (
                                    <FaCheckCircle
                                        className="text-white"
                                        size={14}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Bottom Sheet */}
            <Transition
                appear
                show={isOpen && isMobileBreakpoints}
                as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/75" />
                    </Transition.Child>

                    <div className="fixed inset-0">
                        <div className="flex min-h-full items-start md:items-center justify-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="-translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
                                enterTo="translate-y-0 md:scale-100 md:opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="translate-y-0 md:scale-100 md:opacity-100"
                                leaveTo="-translate-y-full md:translate-y-0 md:scale-95 md:opacity-0">
                                <Dialog.Panel className="w-full transform bg-[#0a0a0a] shadow-xl rounded-b-3xl px-6 py-6 pb-8">
                                    <div className="flex items-center justify-center mb-6">
                                        <Dialog.Title className="text-white text-lg font-semibold text-center">
                                            Ganti Mode
                                        </Dialog.Title>
                                    </div>

                                    {/* Role Cards */}
                                    <div className="flex flex-col gap-3 pb-2">
                                        {roles.map((role) => (
                                            <button
                                                key={role.id}
                                                onClick={() =>
                                                    handleRoleSelect(role)
                                                }
                                                className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-2xl ${
                                                    selectedRole?.id === role.id
                                                        ? 'bg-[#5b4cdb] hover:bg-[#6d5ee5]'
                                                        : 'hover:bg-[#252525] border border-[#2C2C2C]'
                                                }`}>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-white font-semibold font-[Urbanist]">
                                                                {role.label}
                                                            </span>
                                                            {role.badge &&
                                                                role.badge}
                                                        </div>
                                                        <span
                                                            className={`text-sm ${
                                                                selectedRole?.id ===
                                                                role.id
                                                                    ? 'text-white'
                                                                    : 'text-gray-400'
                                                            }`}>
                                                            {role.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                {selectedRole?.id ===
                                                    role.id && (
                                                    <FaCheckCircle
                                                        className="text-white"
                                                        size={14}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default RoleSwitcher;
