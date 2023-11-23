import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetCommunityNotificationQuery } from 'komunitas/redux/api/komunitasApi';
import React from 'react';
import { useSelector } from 'react-redux';

const CommunityNotificationBadge = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: communityNotification } = useGetCommunityNotificationQuery(
        isAuthenticated ? undefined : skipToken
    );

    return communityNotification?.unseen_comment_counts ? (
        <span className="inline-block leading-none h-min py-[2px] pl-[3px] pr-[4px] font-body text-center text-white text-[10px] bg-[#B92011] rounded-full">
            {communityNotification?.unseen_comment_counts}
        </span>
    ) : (
        <></>
    );
};

export default CommunityNotificationBadge;
