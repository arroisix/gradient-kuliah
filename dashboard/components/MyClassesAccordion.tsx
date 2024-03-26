import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { AstronoteBookCard } from 'courses/components/LearningExperience/AstroNotes/AstronoteBook';
import { useGetClassProgressQuery } from 'dashboard/redux/api/dashboardApi';
import Image from 'next/image';
import React, { useState } from 'react';
const EMPTY_ASSET = `${CDN_URL}/assets/dashboard-subscribe.png`;

const MyClassesAccordion = ({
    isLoading,
    courses
}: {
    isLoading: boolean;
    courses?: GetDashboardContentResponse['my_class'];
}): JSX.Element => {
    const [course, setCourse] = useState('');
    const { data, isFetching } = useGetClassProgressQuery(
        { slug: course },
        { skip: !course }
    );

    return (
        <div className="space-y-4 md:pr-16">
            <h4 className="text-lg font-extrabold md:text-xl">Kelasku</h4>
            {isLoading && <Skeleton />}
            {!isLoading && courses && courses.length > 0 ? (
                courses.map(({ course_slug: slug, name }) => (
                    <label
                        key={slug}
                        className="rounded-lg collapse collapse-arrow bg-neutral-800">
                        <input
                            type="checkbox"
                            name="kelasku"
                            onChange={() =>
                                setCourse((prev) => (prev == slug ? '' : slug))
                            }
                            checked={slug == course}
                            className="min-h-0"
                        />
                        <div className="!px-4 !py-3 font-bold collapse-title min-h-fit md:!py-4 md:!px-5 collapse-arrow">
                            {name}
                        </div>
                        <div className="collapse-content">
                            <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
                                {!isFetching &&
                                    data?.class_progress.map((progress) => (
                                        <AstronoteBookCard
                                            key={progress.id}
                                            slug={progress.book_slug}
                                            book_cover_url={progress.thumbnail}
                                            category_name=""
                                            title={progress.title}
                                            percentage_progress={
                                                progress.percentage_progress
                                            }
                                            last_chapter_read={
                                                progress.latest_chapter
                                            }
                                            id={progress.id}
                                            rating={0}
                                            category_id=""
                                            is_free
                                            is_public
                                            in_progress
                                        />
                                    ))}
                                {isFetching && (
                                    <Skeleton
                                        repeat={3}
                                        className="h-36 !mb-0"
                                    />
                                )}
                            </div>
                            <Button
                                variant="custom"
                                href={`/kelas/${slug}`}
                                className="w-full text-xs text-center text-black bg-white">
                                Lihat Kelas
                            </Button>
                        </div>
                    </label>
                ))
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

const EmptyState = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <div className="relative z-0 flex flex-col w-full gap-6 p-4 overflow-hidden md:gap-8 rounded-xl md:p-6 bg-neutral-800">
            <div className="absolute z-0 object-contain -bottom-3 -right-4 sm:right-0 saturate-0 opacity-20">
                <Image
                    src={EMPTY_ASSET}
                    width={198 * (isMobileBreakpoints ? 0.75 : 1)}
                    height={183 * (isMobileBreakpoints ? 0.75 : 1)}
                    objectFit="contain"
                />
            </div>
            <div>
                <h5 className="z-[1] font-bold md:text-lg">Belum ada kelas</h5>
                <p>Telusuri materi Gradient dan mulai belajar sekarang!</p>
            </div>
            <Button
                variant="custom"
                eventName="Click Hero Banner (Registered)"
                className="font-sans text-xs font-bold text-black bg-white w-fit z-[1] mt-12 min-[375px]:mt-0"
                href="/kelas">
                Telusuri Kelas
            </Button>
        </div>
    );
};

export default MyClassesAccordion;
