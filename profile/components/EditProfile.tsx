import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PROFILE_MANAGEMENT_FORMS } from 'profile/constants';
import { useProfileContext } from 'profile/contexts/ProfileProvider';
import { FaAngleLeft } from 'react-icons/fa';

export const EditProfile = (): JSX.Element => {
    const { profile, menuName } = useProfileContext();
    const router = useRouter();

    const Form = PROFILE_MANAGEMENT_FORMS[router.pathname];

    const backPath =
        router.pathname.split('/').slice(0, -1).join('/') || '/profil';

    if (!profile) {
        return <LoadingBackdrop />;
    } else {
        return (
            <div className="flex flex-col w-full gap-4">
                <div className="flex items-center w-full gap-4">
                    <Link href={backPath}>
                        <FaAngleLeft
                            size={24}
                            className="hover:text-[#7264EB] transition-all duration-500 cursor-pointer"
                        />
                    </Link>
                    <span className="text-lg font-semibold">{menuName}</span>
                </div>
                <Form />
            </div>
        );
    }
};
