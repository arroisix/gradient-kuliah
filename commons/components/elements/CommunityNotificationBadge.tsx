import { useGetCommunityNotificationQuery } from 'komunitas/redux/api/komunitasApi';
import React from 'react';

const CommunityNotificationBadge = (): JSX.Element => {
    const { data: communityNotification } = useGetCommunityNotificationQuery();

    return communityNotification?.unseen_comment_counts ? (
        <span className="inline-block leading-none h-min py-[2px] pl-[3px] pr-[4px] font-body text-center text-white text-[10px] bg-[#B92011] rounded-full">
            {communityNotification?.unseen_comment_counts}
        </span>
    ) : (
        <></>
    );
};

export default CommunityNotificationBadge;
