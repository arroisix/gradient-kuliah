import { useAuth } from 'authentication/contexts/AuthProvider';
import { useUpdateUserMutation } from 'authentication/redux/api/authApi';
import Modal from 'commons/components/modules/Modal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UpdateProfileNotification = (): JSX.Element => {
    const { pathname } = useRouter();
    const EXCLUDED_PATHNAME = ['/keluar-perangkat', '/profil/pendidikan'];
    const { profile } = useAuth();
    const [update] = useUpdateUserMutation();

    const getNotificationDisplayStatus = (): boolean => {
        if (EXCLUDED_PATHNAME.includes(pathname)) {
            return false;
        }
        return profile?.display_update_data_notification ?? false;
    };

    const [notificationIsDisplayed, setNotificationIsDisplayed] =
        useState<boolean>(getNotificationDisplayStatus());

    useEffect(() => {
        setNotificationIsDisplayed(getNotificationDisplayStatus());
    }, [profile, pathname]);

    const userHasReceivedNotification = async () => {
        setNotificationIsDisplayed(false);
        const payload = {
            ...profile,
            phone_number: profile?.phone_number
                ? profile?.phone_number.replace('+62', '')
                : '',
            birthdate: profile?.birthdate
                ? profile?.birthdate.split('T')[0]
                : ''
        };
        await update(payload);
    };

    if (!notificationIsDisplayed) return <></>;

    return (
        <div
            aria-hidden={true}
            className="fixed inset-0 w-full h-full backdrop-blur"
            style={{ zIndex: 1000 }}>
            <Modal
                isOpen={notificationIsDisplayed}
                setOpen={setNotificationIsDisplayed}
                permanent={true}
                dialog={true}
                variant="dark"
                className="bg-[#1D1D1D] md:bg-[#272727] flex flex-col gap-6 pt-8 pb-7 px-6">
                <div className="flex flex-col text-center gap-3">
                    <span className="font-sans font-extrabold text-xl">
                        Masuk semester baru, saatnya update data pendidikan
                    </span>
                    <span className="text-[#BBBBBB]">
                        Update data Pendidikan untuk mendapat rekomendasi materi
                        yang relevan
                    </span>
                </div>

                <div className="flex flex-col gap-5 items-center">
                    <Link
                        href={'/profil/pendidikan'}
                        onClick={userHasReceivedNotification}
                        className="w-full py-3 text-center bg-[#5F2BCE] rounded-[70px] font-semibold duration-300 md:hover:bg-[#5F2BCE]/[0.85] transition-all ease-in-out">
                        Update Data Pendidikan
                    </Link>
                    <div className="group">
                        <button
                            className="w-fit text-[#B6A6F3] font-semibold"
                            onClick={userHasReceivedNotification}>
                            Nanti Saja
                        </button>
                        <hr className="w-full hidden md:flex mt-1 mb-0 h-[2px] group-hover:bg-[#B6A6F3] border-none duration-300 transition-all ease-in-out" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UpdateProfileNotification;
