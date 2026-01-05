import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import { useRouter } from 'next/router';
import { EditProfile, ProfileMenuTab } from 'profile/components';
import { PROFILE_MENUS } from 'profile/constants';
import { ProfileProvider } from 'profile/contexts/ProfileProvider';
import { HiArrowRight } from 'react-icons/hi';
import Button from 'commons/components/elements/Button';
import { useAuth } from 'authentication/contexts/AuthProvider';
import {
    useGetProfileQuery,
    useUpdateUserMutation
} from 'authentication/redux/api/authApi';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';

const SwitcherCard = () => {
    const { profile } = useAuth();
    const { data } = useGetProfileQuery({});
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const router = useRouter();

    const handleRoleSelect = async () => {
        if (profile && data) {
            try {
                // Update user role in backend first
                await updateUser({
                    ...data,
                    phone_number: data.phone_number.replace(/\+/g, ''),
                    current_role: 'COLLEGE_STUDENT'
                }).unwrap();
                router.replace('/dashboard');
            } catch (error) {
                console.error('Failed to update role:', error);
            }
        }
    };

    if (isUpdating) {
        return <LoadingBackdrop />;
    }

    return (
        <div className="w-full mb-6">
            <div className="relative w-full overflow-hidden rounded-2xl bg-black p-8">
                <div className="-bottom-16 -right-36 absolute rounded-tl-full bg-[#dc4b8f] h-64 w-64 z-[3] blur-xl"></div>
                <div className="-bottom-16 -right-24 absolute rounded-tl-full bg-purple-500 h-72 w-72 z-[2] blur-xl"></div>
                <div className="-bottom-16 -right-12 absolute rounded-tl-full bg-[#5935a8]  h-80 w-80 z-[1] blur-xl"></div>
                <div className="-bottom-16 -right-24 absolute rounded-tl-full bg-blue-700 h-96 w-96 z-[0] blur-3xl"></div>

                <div className="relative z-10 w-full">
                    <h2 className="text-white text-2xl font-bold mb-3 font-[Urbanist]">
                        Gradient
                    </h2>

                    <p className="text-white text-[15px] leading-relaxed mb-1">
                        Pahami materi kuliah dan skill karir dari dosen top
                        universitas.
                    </p>
                    <p className="text-white text-[15px] leading-relaxed mb-8">
                        Penjelasan visual yang bikin konsep susah{' '}
                        <strong className="font-semibold">
                            jadi lebih mudah dimengerti.
                        </strong>
                    </p>

                    <div className="flex items-center gap-6 w-full justify-end">
                        <Button
                            variant="tertiary"
                            href="https://gradient.academy/">
                            Pelajari lebih lanjut
                        </Button>

                        <Button
                            onClick={handleRoleSelect}
                            variant="custom"
                            className="bg-white text-[#5b3a9e] flex items-center gap-2 hover:text-[#5b3a9e]/80">
                            Beralih ke Mode Kuliah
                            <HiArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProfileContainer = (): JSX.Element => {
    const { pathname } = useRouter();
    const { data: configData } = useGetConfigQuery();

    const filteredMenus = PROFILE_MENUS.filter(({ label }) => {
        if (label === 'Kartu Kredit/Debit') {
            return configData?.configs?.is_credit_card_config_enabled;
        }
        return true;
    });

    return (
        <ProfileProvider>
            <div className="flex justify-center w-full h-screen px-4 pt-8">
                <div className="flex flex-col w-full gap-2 md:w-1/2">
                    {pathname === '/profil' ? (
                        <>
                            <SwitcherCard />
                            <>
                                {filteredMenus.map(
                                    ({ Icon, ...props }, index) => (
                                        <ProfileMenuTab
                                            key={index}
                                            {...props}
                                            icon={<Icon size={24} />}
                                        />
                                    )
                                )}
                            </>
                        </>
                    ) : (
                        <EditProfile />
                    )}
                </div>
            </div>
        </ProfileProvider>
    );
};
