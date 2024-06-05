import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { AstronoteBookCard } from 'courses/components/LearningExperience/AstroNotes/AstronoteBook';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';
import { useGetClassProgressQuery } from 'dashboard/redux/api/dashboardApi';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTracker } from 'tracker/tracker';
const EMPTY_ASSET = `${CDN_URL}/assets/dashboard-subscribe.png`;

const MyClassesAccordion = ({
    isLoading,
    courses
}: {
    isLoading: boolean;
    courses?: GetDashboardContentResponse['my_class'];
}): JSX.Element => {
    const [course, setCourse] = useState('');
    const tracker = useTracker();
    const { data, isFetching } = useGetClassProgressQuery(
        { slug: course },
        { skip: !course }
    );

    const toggleAccordion = (slug: string, name: string): void => {
        if (course !== slug)
            tracker?.genericTrack('User click "Kelasku" Accordion', {
                Course: name
            });
        setCourse((prev) => (prev == slug ? '' : slug));
    };

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
                            onChange={() => toggleAccordion(slug, name)}
                            checked={slug == course}
                            className="min-h-0"
                        />
                        <div className="!px-4 !py-3 font-bold collapse-title min-h-fit md:!py-4 md:!px-5 collapse-arrow">
                            {name}
                        </div>
                        <div className="collapse-content">
                            <div
                                className={cn(
                                    'grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3 lg:grid-rows-1',
                                    {
                                        'grid-rows-2':
                                            data?.class_progress.length == 2,
                                        'grid-rows-3':
                                            data?.class_progress.length == 3
                                    }
                                )}>
                                {!isFetching ? (
                                    data?.class_progress.map((progress) => (
                                        <ProgressItem
                                            key={progress.id}
                                            progress={progress}
                                            courseName={name}
                                        />
                                    ))
                                ) : (
                                    <Skeleton
                                        repeat={3}
                                        className="h-36 !mb-0"
                                    />
                                )}
                            </div>
                            <Button
                                variant="custom"
                                href={`/kelas/${slug}`}
                                eventName='User click "Lihat Kelas" Button on Accordion'
                                eventPayload={{ Course: name }}
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

const ProgressItem = ({
    progress,
    courseName
}: {
    progress: ClassProgress;
    courseName: string;
}): JSX.Element => {
    const { book_slug } = progress
    const { data: getBookDetail } = useGetBookDetailQuery({ slug: book_slug }, { skip: !book_slug });

    const getHref = (): string => {
        switch (progress.type) {
            case 'book':
                return getBookDetail?.book.category.toLowerCase() === 'catatan'? `/perpustakaan/astronotes/${book_slug}/${progress.latest_page}` : `/perpustakaan/bank-soal/${book_slug}/${progress.latest_page}`;
            case 'textbook':
                return `/perpustakaan/textbook/${book_slug}/${progress.latest_page}`;
            case 'video':
                return `/kelas/${progress.course_slug}/belajar/video/${progress.chapter_id}/${progress.subchapter_id}`;
            default:
                return '?';
        }
    };

    return (
        <AstronoteBookCard
            key={progress.id}
            slug={progress.book_slug}
            book_cover_url={progress.thumbnail}
            category_name=""
            title={progress.title}
            percentage_progress={progress.percentage_progress}
            last_chapter_read={progress.latest_chapter}
            type={progress.type}
            id={progress.id}
            rating={0}
            category_id=""
            is_free
            is_public
            in_progress
            href={getHref()}
            imageClassname="min-h-24 lg:min-h-16"
            eventName='User click item on "Kelasku" Accordion'
            eventPayload={{
                Course: courseName,
                Title: progress.title,
                Type: progress.type
            }}
        />
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
                className="font-sans text-xs font-bold text-black bg-white w-fit z-[1] mt-12 min-[375px]:mt-0"
                eventName={`User click "Telusuri Kelas" Button when user don't have any Class Progress yet`}
                href="/kelas">
                Telusuri Kelas
            </Button>
        </div>
    );
};

export default MyClassesAccordion;
