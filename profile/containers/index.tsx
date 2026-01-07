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
import UTBKLogo from 'commons/components/modules/Navbar/components/utbk/UTBKLogo';
import Image from 'next/image';
import { useState } from 'react';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import CollegeLogo from 'commons/components/modules/Navbar/components/CollegeLogo';

const SwitcherCard = () => {
    const { profile } = useAuth();
    const { data } = useGetProfileQuery({});
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleRoleSelect = async () => {
        if (profile && data) {
            try {
                // Update user role in backend first
                setIsNavigating(true);
                await updateUser({
                    ...data,
                    phone_number: data.phone_number.replace(/\+/g, ''),
                    current_role:
                        profile.current_role === 'K12'
                            ? 'COLLEGE_STUDENT'
                            : 'K12'
                }).unwrap();

                if (profile.current_role === 'K12') {
                    await router.replace('/dashboard');
                } else {
                    await router.replace('/utbk/dashboard');
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

    if (profile?.current_role === 'K12') {
        return (
            <div className="w-full mb-6">
                <div className="relative w-full overflow-hidden rounded-2xl bg-black p-4 lg:p-8 flex flex-col gap-4 border-[1px] border-[#2C2C2C]">
                    <div className="-bottom-28 -right-48 lg:-bottom-16 lg:-right-36 absolute rounded-tl-full bg-[#dc4b8f] h-64 w-64 z-[3] blur-2xl"></div>
                    <div className="-bottom-28 -right-48 lg:-bottom-16 lg:-right-24 absolute rounded-tl-full bg-purple-500/50 h-72 w-72 z-[2] blur-xl"></div>
                    <div className="-bottom-28 -right-48 lg:-bottom-16 lg:-right-12 absolute rounded-tl-full bg-[#5935a8]  h-80 w-80 z-[1] blur-xl"></div>
                    <div className="-bottom-28 -right-48 lg:-bottom-16 lg:-right-24 absolute rounded-tl-full bg-blue-700/70 h-96 w-96 z-[0] blur-3xl"></div>

                    <div className="relative z-10 w-full flex flex-col gap-4">
                        <div className="flex flex-row gap-2 items-center">
                            <h2 className="text-white text-2xl font-bold font-[Urbanist]">
                                Gradient
                            </h2>
                            <CollegeLogo />
                        </div>

                        <p className="text-[#DEDEDE] text-[14px] leading-relaxed mb-1">
                            Pahami materi kuliah dan skill karir dari dosen top
                            universitas. Penjelasan visual yang bikin konsep
                            susah{' '}
                            <strong className="font-bold text-white">
                                jadi lebih mudah dimengerti.
                            </strong>
                        </p>

                        <div className="flex flex-col-reverse lg:flex-row items-center gap-2 lg:gap-6 w-full justify-end z-[5]">
                            <Button
                                className="w-full lg:w-auto text-center"
                                variant="tertiary"
                                href="https://gradient.academy/">
                                Pelajari lebih lanjut
                            </Button>

                            <Button
                                onClick={handleRoleSelect}
                                variant="custom"
                                className="bg-white text-[#5b3a9e] flex items-center gap-2 hover:text-[#5b3a9e]/80 w-full lg:w-auto justify-center">
                                Beralih ke Mode Kuliah
                                <HiArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mb-6">
            <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#9333EA]/30 via-[#9333EA]/30 to-black p-4 lg:p-8 border-[1px] border-[#2C2C2C]">
                <div className="absolute  -bottom-2 lg:-bottom-8 -right-32">
                    <Image
                        src={
                            'https://assets.gradient.academy/assets/utbk_student.png'
                        }
                        alt="Student"
                        width={650}
                        height={isMobileBreakpoints ? 300 : 250}
                        className="w-auto object-cover lg:object-contain"
                    />
                </div>
                <div className="relative z-10 w-full flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                        <h2 className="text-white text-2xl font-bold font-[Urbanist]">
                            Gradient
                        </h2>
                        <UTBKLogo />
                    </div>

                    <p className="text-[#DEDEDE] text-[14px] leading-relaxed mb-1">
                        Materi terstruktur, latihan soal, dan prediksi peluang
                        masuk PTN untuk persiapan UTBK.
                    </p>

                    <div className="flex flex-col-reverse lg:flex-row items-center gap-2 lg:gap-6 w-full justify-end z-[5]">
                        <Button
                            className="w-full lg:w-auto text-center"
                            variant="tertiary"
                            href="https://gradient.academy/utbk">
                            Pelajari lebih lanjut
                        </Button>

                        <Button
                            onClick={handleRoleSelect}
                            variant="custom"
                            className="bg-white text-[#5b3a9e] flex items-center gap-2 hover:text-[#5b3a9e]/80 w-full lg:w-auto justify-center">
                            Beralih ke Mode UTBK
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
