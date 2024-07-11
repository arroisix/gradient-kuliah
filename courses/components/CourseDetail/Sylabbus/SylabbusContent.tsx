// import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import GreenCheck from 'commons/components/elements/Icons/GreenCheck';
import Play from 'commons/components/elements/Icons/Play';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import Link from 'next/link';
import React from 'react';
import { useTracker } from 'tracker/tracker';

const SylabbusContent = ({
    id,
    slug
}: GradientBaseComponentWithId & { slug: string }): JSX.Element => {
    const { data: subchapters, isLoading } = useGetSubchapterQuery(
        { chapterId: id },
        {
            skip: !id,
            selectFromResult: ({ data, isLoading }) => ({
                data: data?.subchapters.filter(({ type }) => type === 'video'),
                isLoading: isLoading
            })
        }
    );
    const tracker = useTracker();

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
            {(subchapters?.length ?? 0) == 0 && (
                <p>Sabar ya, materi ini akan segera hadir untukmu.</p>
            )}
            {subchapters?.map((subchapter: SubChapter) => (
                <Link
                    key={subchapter.id}
                    href={`/kelas/${slug}/${subchapter.subchapter_slug}`}
                    onClick={() => {
                        tracker?.genericTrack('Click SubChapter Video Item', {
                            'Course Slug': slug,
                            'Chapter Name': id,
                            'Sub Chapter Name': subchapter.subchapter_name
                        });
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
                            {subchapter.is_finished ? <GreenCheck /> : <Play />}
                        </div>
                        <div className="flex flex-col text-left">
                            <h4 className="text-lg text-neutral-200">
                                {subchapter.subchapter_name}
                            </h4>
                            <p className="text-lg text-neutral-600">
                                {subchapter.duration}
                            </p>
                        </div>
                        <span className="sr-only">
                            {`/kelas/${slug}/${subchapter.subchapter_slug}`}
                        </span>
                    </button>
                </Link>
            ))}
        </div>
    );
};

export default SylabbusContent;
