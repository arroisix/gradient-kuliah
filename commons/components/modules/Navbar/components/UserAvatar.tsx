import Image from 'next/image';
import React from 'react';
import Avatar from 'react-avatar';

const UserAvatar = ({
    profile
}: {
    profile?: UpdateUserResponseData;
}): JSX.Element => {
    return !profile ? (
        <div className="w-[23px] h-[23px] bg-neutral-600 animate-pulse rounded-full"></div>
    ) : !!profile.photo_profile ? (
        <div className="w-[23px] h-[23px] relative">
            <Image
                src={profile.photo_profile}
                layout="fill"
                className="rounded-full"
            />
        </div>
    ) : (
        <Avatar name={profile.username} size="23" round />
    );
};

export default UserAvatar;
