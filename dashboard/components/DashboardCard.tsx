import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTracker } from 'tracker/tracker';

const DashboardCard = ({
    eventName,
    eventPayload = {},
    ...item
}: LearningMaterial & {
    eventName?: string;
    eventPayload?: Record<string, unknown>;
}): JSX.Element => {
    const isVideo = item.type?.toLowerCase() === 'video';
    const isCourse = item.type?.toLowerCase() === 'kelas';
    const tracker = useTracker();
    const getLink = (): string => {
        const baseHref = item.type?.toLowerCase() === 'textbook'
                            ? `/perpustakaan/textbook/${item.book_slug}`
                            : item.type?.toLowerCase() === 'catatan'?
                                `/perpustakaan/astronotes/${item.book_slug}`
                                :  `/perpustakaan/bank-soal/${item.book_slug}`;

        if (isVideo || isCourse) {
            if (item?.chapter_id && item.subchapter_id)
                return `/kelas/${item.course_slug}/belajar/video/${item.chapter_id}/${item.subchapter_id}`;
            return `/kelas/${item.course_slug}`;
        } else {
            if (item.in_progress && !!item.latest_page) {
                return `${baseHref}/${item.latest_page}`
            }
            return baseHref;
        }
    };

    return (
        <Link
            href={getLink()}
            onClick={() => {
                if (eventName) tracker?.genericTrack(eventName, eventPayload);
            }}
            className="flex h-full flex-col w-full border rounded-md border-[#242424] bg-neutral-950 overflow-clip">
            <div
                className={cn(
                    'bg-[#242424] sm:h-[160px] h-[150px] object-contain'
                )}>
                <div
                    className={cn(
                        'relative rounded-t-md',
                        !(isVideo || isCourse)
                            ? 'p-2.5 h-[160px] mx-auto object-contain aspect-[256/364]'
                            : 'w-full h-full overflow-clip'
                    )}>
                    <Image
                        src={
                            item.thumbnail ||
                            `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                        }
                        alt={item.title}
                        width={!(isVideo || isCourse) ? 256 : undefined}
                        height={!(isVideo || isCourse) ? 364 : undefined}
                        layout={isVideo || isCourse ? 'fill' : 'responsive'}
                        className={cn(
                            isVideo || isCourse
                                ? 'object-cover object-center'
                                : 'rounded object-contain'
                        )}
                        // crossOrigin="anonymous"
                        // unoptimized
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1 p-2">
                <p className="text-xs text-neutral-400">
                    {item.type === 'Video' ? 'Kelas' : item.type}
                </p>
                <p className="text-sm font-bold text-white">{item.title}</p>
            </div>
        </Link>
    );
};

export default DashboardCard;
