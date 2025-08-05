import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PROFILE_MANAGEMENT_FORMS } from 'profile/constants';
import { useProfileContext } from 'profile/contexts/ProfileProvider';
import { useEffect } from 'react';
import { FaAngleLeft } from 'react-icons/fa';

export const EditProfile = (): JSX.Element => {
    const { profile, menuName } = useProfileContext();
    const router = useRouter();
    const { data: configData, isLoading: isConfigLoading } =
        useGetConfigQuery();

    const Form = PROFILE_MANAGEMENT_FORMS[router.pathname];

    const backPath =
        router.pathname.split('/').slice(0, -1).join('/') || '/profil';

    const isCreditCardPath = router.pathname.includes('/kartu-kredit');

    // Redirect to 404 if credit cards are disabled and user is on credit card path
    useEffect(() => {
        if (
            !isConfigLoading &&
            isCreditCardPath &&
            !configData?.configs?.is_credit_card_config_enabled
        ) {
            router.replace('/404');
        }
    }, [configData, isConfigLoading, isCreditCardPath, router]);

    // Show loading while checking config
    if (isConfigLoading) {
        return <LoadingBackdrop />;
    }

    // Don't render if credit cards are disabled and this is a credit card path
    if (
        isCreditCardPath &&
        !configData?.configs?.is_credit_card_config_enabled
    ) {
        return <></>;
    }

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
