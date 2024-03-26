import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';
import React from 'react';

const DashboardCard = (item: LearningMaterial): JSX.Element => {
    const isVideo = item.type.toLowerCase() === 'video';
    return (
        <div className="flex flex-col w-full border rounded-md border-neutral-600 bg-neutral-900">
            <div className="bg-[#242424] sm:h-[160px] h-[150px] object-contain">
                <div
                    className={cn(
                        'relative rounded-t-md',
                        item.type !== 'Video'
                            ? 'p-2.5 h-[160px] mx-auto object-contain aspect-[256/364]'
                            : 'w-full h-full overflow-clip'
                    )}>
                    <Image
                        src={
                            // item.thumbnail ||
                            `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                        }
                        alt={item.title}
                        width={!isVideo ? 256 : undefined}
                        height={!isVideo ? 364 : undefined}
                        layout={isVideo ? 'fill' : 'responsive'}
                        className={
                            isVideo
                                ? 'object-cover object-center'
                                : 'rounded object-contain'
                        }
                        unoptimized
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1 p-2">
                <p className="text-xs text-neutral-400">{item.type}</p>
                <p className="text-sm font-bold text-white">{item.title}</p>
            </div>
        </div>
    );
};

export default DashboardCard;
