import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import FreeBadge from 'commons/components/elements/FreeBadge';
import GreenCheck from 'commons/components/elements/Icons/GreenCheck';
import Play from 'commons/components/elements/Icons/Play';
import Skeleton from 'commons/components/elements/Skeleton';
import { formatDuration } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';

const SylabbusContent = ({
    id,
    slug
}: GradientBaseComponentWithId & { slug: string }): JSX.Element => {
    const { is_subscribed } = useCourseSubscription();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: subchapters, isLoading } = useGetSubchapterQuery(
        { chapterId: id },
        {
            skip: !id,
            selectFromResult: ({ data, isLoading }) => ({
                data: data?.subchapters.filter(
                    ({ type }) => type === 'video' || type === 'exercise'
                ),
                isLoading: isLoading
            })
        }
    );
    const tracker = useTracker();

    const decideURLLink = (subchapter: SubChapter): string => {
        if (isAuthenticated) {
            if (is_subscribed || subchapter.is_free) {
                return `/latihan/${subchapter?.exercise_slug}`;
            } else {
                return '/langganan';
            }
        } else {
            return '/masuk';
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {isLoading && (
                <>
                    <div className="relative flex items-center w-full gap-4">
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </div>
                    <div className="relative flex items-center w-full gap-4">
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </div>
                    <div className="relative flex items-center w-full gap-4">
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </div>
                    <div className="relative flex items-center w-full gap-4">
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </div>
                </>
            )}
            {(subchapters?.length ?? 0) == 0 && !isLoading && (
                <p>Sabar ya, materi ini akan segera hadir untukmu.</p>
            )}
            {subchapters?.map((subchapter: SubChapter) => {
                if (subchapter.type === 'video') {
                    return (
                        <Link
                            key={subchapter.id}
                            href={`/kelas/${slug}/${subchapter.subchapter_slug}`}
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click SubChapter Video Item',
                                    {
                                        'Course Slug': slug,
                                        'Chapter Name': id,
                                        'Sub Chapter Name':
                                            subchapter.subchapter_name
                                    }
                                );
                            }}>
                            <button className="relative flex items-center w-full gap-4">
                                <div className="h-[98px] min-w-[163px]">
                                    <img
                                        src={subchapter.thumbnail}
                                        className="h-[98px] w-[163px] overflow-hidden rounded-lg object-cover"
                                        alt="Video Thumbnail"
                                    />
                                </div>
                                <div>
                                    {subchapter.is_finished ? (
                                        <GreenCheck />
                                    ) : (
                                        <Play />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 text-left">
                                    <h4 className="text-sm text-white">
                                        {subchapter.subchapter_name}
                                    </h4>
                                    {subchapter.is_free && <FreeBadge />}
                                    <p className="text-xs text-graphite-600">
                                        {formatDuration(subchapter.duration)}
                                    </p>
                                </div>
                                <span className="sr-only">
                                    {`/kelas/${slug}/${subchapter.subchapter_slug}`}
                                </span>
                            </button>
                        </Link>
                    );
                } else if (subchapter.type === 'exercise') {
                    return (
                        <Link
                            key={subchapter.id}
                            href={decideURLLink(subchapter)}>
                            <button className="relative flex items-center w-full gap-4">
                                <div className="h-[98px] min-w-[163px]">
                                    <img
                                        src={
                                            'https://assets.gradient.academy/assets/gradient_generic_thumbnail_black.jpg'
                                        }
                                        className="h-[98px] w-[163px] overflow-hidden rounded-lg object-fill"
                                        alt="Video Thumbnail"
                                    />
                                </div>
                                <div>
                                    {subchapter.is_finished ? (
                                        <GreenCheck />
                                    ) : (
                                        <span className="text-2xl">
                                            {subchapter.icon}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 text-left">
                                    <h4 className="text-sm text-white">
                                        {subchapter.title}
                                    </h4>
                                    {subchapter.is_free && <FreeBadge />}
                                    <p className="text-xs text-graphite-600">
                                        {`Nilai Minimum: ${subchapter.minimum_score}`}
                                    </p>
                                </div>
                                <span className="sr-only">
                                    {decideURLLink(subchapter)}
                                </span>
                            </button>
                        </Link>
                    );
                } else {
                    return <></>;
                }
            })}
        </div>
    );
};

export default SylabbusContent;
