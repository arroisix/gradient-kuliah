import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Link from 'next/link';
import { PersonalDataForm } from 'profile/components/PersonalDataForm';
import { useProfileContext } from 'profile/contexts/ProfileProvider';
import { FaAngleLeft } from 'react-icons/fa';

export const EditProfile = (): JSX.Element => {
    const { profile, menuName } = useProfileContext();

    return !profile ? (
        <LoadingBackdrop />
    ) : (
        <div className="flex flex-col w-full gap-4">
            <div className="flex items-center w-full gap-4">
                <Link href={'/profil'}>
                    <FaAngleLeft
                        size={24}
                        className="hover:text-[#7264EB] transition-all duration-500 cursor-pointer"
                    />
                </Link>
                <span className="text-lg font-semibold">{menuName}</span>
            </div>
            <PersonalDataForm {...profile} />
        </div>
    );
};
