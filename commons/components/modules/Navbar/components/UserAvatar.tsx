import Image from 'next/image';
import React from 'react';
import Avatar from 'react-avatar';

const UserAvatar = ({
    profile
}: {
    profile?: UpdateUserResponseData;
}): JSX.Element => {
    return !profile ? (
        <div className="shrink-0 w-8 h-8 bg-neutral-600 animate-pulse rounded-full"></div>
    ) : !!profile.photo_profile ? (
        <div className="shrink-0 relative w-8 h-8 rounded-full grid place-items-center overflow-hidden">
            <Image
                src={profile.photo_profile}
                layout="fill"
                className="object-cover object-center"
            />
        </div>
    ) : (
        <Avatar name={profile.username} size="32" round />
    );
};

export default UserAvatar;
