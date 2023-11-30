import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaAngleRight } from 'react-icons/fa';

interface ProfileMenuTabProps {
    icon: ReactNode;
    label: string;
    url: string;
    featureFlag?: string;
}

const ProfileMenuTabItem = ({
    icon,
    label,
    url
}: ProfileMenuTabProps): JSX.Element => {
    return (
        <Link href={url}>
            <div className="flex items-center justify-between p-2 transition-all duration-500 rounded-lg cursor-pointer hover:bg-white/20">
                <div className="flex items-center gap-4">
                    {icon} <span>{label}</span>
                </div>
                <FaAngleRight />
            </div>
        </Link>
    );
};

export const ProfileMenuTab = (props: ProfileMenuTabProps): JSX.Element => {
    return props?.featureFlag ? (
        <IfFeatureEnabled feature={props.featureFlag}>
            <ProfileMenuTabItem {...props} />
        </IfFeatureEnabled>
    ) : (
        <ProfileMenuTabItem {...props} />
    );
};
