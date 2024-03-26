import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const DashboardCard = (item: LearningMaterial): JSX.Element => {
    const isVideo = item.type?.toLowerCase() === 'video';
    const getLink = (): string => {
        if (isVideo) {
            if (item?.chapter_id && item.subchapter_id)
                return `/kelas/${item.course_slug}/${item.chapter_id}/${item.subchapter_id}`;
            return `/kelas/${item.course_slug}`;
        } else {
            if (item.in_progress && item.latest_page > 0)
                return `/astronotes/${item.book_slug}/${item.latest_page}`;
            return `/astronotes/${item.book_slug}`;
        }
    };

    return (
        <Link
            href={getLink()}
            className="flex flex-col w-full border rounded-md border-neutral-700 bg-neutral-950 overflow-clip">
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
                            item.thumbnail ||
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
                        // crossOrigin="anonymous"
                        // unoptimized
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1 p-2">
                <p className="text-xs text-neutral-400">{item.type}</p>
                <p className="text-sm font-bold text-white">{item.title}</p>
            </div>
        </Link>
    );
};

export default DashboardCard;
