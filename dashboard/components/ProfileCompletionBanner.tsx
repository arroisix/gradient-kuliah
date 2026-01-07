import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoClose } from 'react-icons/io5';
import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import { GraduateIcon } from 'commons/components/elements/Icons/GraduateIcon';

const ProfileCompletionBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { profile } = useAuth();
    const router = useRouter();

    const NON_K12_USER_EDUCATION_LEVELS = ['S1', 'S2', 'S3', 'D3', 'D4'];

    const handleComplete = () => {
        router.push('/profil/pendidikan');
    };

    const handleClose = () => {
        localStorage.setItem('profile-completion-banner-closed', 'true');
        setIsVisible(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isBannerClosed = localStorage.getItem(
                'profile-completion-banner-closed'
            );
            if (isBannerClosed !== 'true') {
                setIsVisible(true);
            }
        }
    }, []);

    if (
        profile?.education_level &&
        NON_K12_USER_EDUCATION_LEVELS.includes(profile.education_level)
    ) {
        return null;
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className="w-full bg-[#252246] rounded-xl p-3 flex flex-col lg:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3 flex-1">
                <div>
                    <GraduateIcon className="fill-[#B6A6F3]" />
                </div>
                <p className="text-white text-sm font-light">
                    Lengkapi profilmu dengan universitas dan jurusan agar
                    rekomendasi belajar lebih relevan.
                </p>
            </div>
            <div className="flex w-full lg:w-auto justify-end items-center gap-2">
                <Button
                    variant="outline"
                    className="block lg:hidden"
                    onClick={handleClose}>
                    Tutup
                </Button>
                <Button variant="primary" onClick={handleComplete}>
                    Lengkapi Profil
                </Button>
                <button
                    onClick={handleClose}
                    className="text-neutral-400 hover:text-gray-200 transition-colors flex-shrink-0 hidden lg:block"
                    aria-label="Close banner">
                    <IoClose size={24} />
                </button>
            </div>
        </div>
    );
};

export default ProfileCompletionBanner;
