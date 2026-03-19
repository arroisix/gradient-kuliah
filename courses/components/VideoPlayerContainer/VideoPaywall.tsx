import { cn } from 'commons/utils';
import React from 'react';
import dynamic from 'next/dynamic';

const VideoPricingList = dynamic(() => import('../utbk/VideoPricingList'));

const VideoPaywall = ({}: { header?: string }): JSX.Element => {
    return (
        <div
            className={cn(
                'py-4 flex flex-col items-center justify-center w-full'
            )}>
            <VideoPricingList />
        </div>
    );
};

export default VideoPaywall;
