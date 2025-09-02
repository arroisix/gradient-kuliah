import Button from 'commons/components/elements/Button';
import SubscribeButton from '../LandingPage/Common/SubscribeButton';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';
import { PercentageProgess } from './LearningProgress/PercentageProgress';
import ShareContentButton from '../ShareContentButton';
import RatingButton from '../CourseRatingButton';
import Link from 'next/link';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import {
    HiOutlineBookOpen,
    HiOutlinePencilAlt,
    HiOutlineChevronRight
} from 'react-icons/hi';
import React, { useEffect, useRef, useState } from 'react';
import { getBookBaseHref } from 'courses/utils';
import RelatedContentModal from './RelatedContentModal';

const CourseDescription = ({
    slug,
    course
}: Pick<GradientBaseComponentWithSlug, 'slug'> & {
    course: CourseLandingPageData;
}): JSX.Element => {
    const {
        is_subscribed,
        latest_watch_video,
        isLoading,
        first_video_in_course
    } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);

    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery({ slug: slug as string });

    const rawItems = courseContent?.books || [];
    const bukuCount = rawItems.filter((b) => b.category !== 'Kuis').length;
    const kuisCount = rawItems.filter((b) => b.category === 'Kuis').length;

    const [isRelatedOpen, setIsRelatedOpen] = useState(false);
    const railRef = useRef<HTMLDivElement | null>(null);
    const [visibleItems, setVisibleItems] = useState<Book[]>([]);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const TILE = 120; // width
        const GAP = 16; // gap-4 (px)

        const compute = (): void => {
            const w = railRef.current?.clientWidth ?? 0;
            if (!w) {
                // Fallback to show up to 3 items if width not known yet
                const fallbackCount = Math.min(3, rawItems.length);
                setVisibleItems(rawItems.slice(0, fallbackCount));
                setRemaining(Math.max(0, rawItems.length - fallbackCount));
                return;
            }

            const slots = Math.max(1, Math.floor((w + GAP) / (TILE + GAP)));
            const needPlus = rawItems.length > slots;
            const itemsToShow = needPlus
                ? Math.max(0, Math.min(rawItems.length, slots - 1))
                : Math.min(rawItems.length, slots);

            setVisibleItems(rawItems.slice(0, itemsToShow));
            setRemaining(Math.max(0, rawItems.length - itemsToShow));
        };

        compute();

        // ResizeObserver -> dynamic recalculation
        const ro =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => compute())
                : null;
        if (railRef.current && ro) ro.observe(railRef.current);

        const onResize = (): void => compute();
        window.addEventListener('resize', onResize);

        return () => {
            if (ro && railRef.current) ro.unobserve(railRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, [rawItems]);

    return (
        <div className="w-screen px-5 lg:w-3/12">
            <div className="flex flex-col gap-4 p-4 bg-zinc-900 rounded-xl">
                <h2 className="font-semibold text-white-500">
                    Tentang Kelas {course?.course_name}
                </h2>
                <div className="w-full h-px bg-gray-500" />
                <div className="text-sm">{course?.description}</div>
                {course?.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 font-semibold text-xs">
                        {course?.tags.map((tag) => {
                            const t = tag as Tag;
                            return (
                                <Link
                                    href={`/search/results/${t.name}`}
                                    target="_blank"
                                    key={`tag-${t.name}`}
                                    className="px-2 h-6 rounded-full border flex justify-center items-center">
                                    {t.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
                <div className="flex gap-3 w-full">
                    <RatingButton />
                    <ShareContentButton
                        typeCopy="COURSE"
                        shareCopy={`Coba deh cek Kelas ${course?.course_name} di Gradient Academy!`}
                    />
                </div>
                <Link
                    href={`/kelas/downloads?search=${encodeURIComponent(
                        course?.course_name || ''
                    )}`}
                    className="flex items-center justify-between w-full py-3 px-4 bg-[#2C2C2C] rounded-full text-white text-sm font-semibold group relative overflow-hidden">
                    <span className="mr-2">Lihat Hasil Download Kamu</span>
                    <div className="absolute right-2">
                        <Image
                            src={`${CDN_URL}/assets/video-downloads-folder.png`}
                            alt="Download Folder"
                            width={86}
                            height={56}
                        />
                    </div>
                </Link>
                <h2 className="text-sm font-semibold text-white-500 uppercase">
                    Pengajar
                </h2>
                <div className="flex flex-col gap-2">
                    {course?.lecturers.map((lecturer: Lecturer) => (
                        <div
                            className="flex items-center gap-2"
                            key={lecturer.name}>
                            <div>
                                <div className="flex items-center justify-center overflow-hidden rounded-full h-11 w-11 bg-neutral-200">
                                    <img
                                        src={lecturer.photo}
                                        className="object-contain object-bottom w-full"
                                        alt="lecturer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <h3>{lecturer.name}</h3>
                                <p className="font-semibold">{lecturer.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {(courseContent?.books?.length ?? 0) > 0 && (
                    <div className="pt-3">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-md font-semibold text-white">
                                Konten Terkait
                            </h3>
                            {bukuCount > 0 && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#2C2C2C] text-xs font-medium text-neutral-300">
                                    <HiOutlineBookOpen size={14} />
                                    {bukuCount} Buku
                                </span>
                            )}
                            {kuisCount > 0 && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#2C2C2C] text-xs font-medium text-neutral-300">
                                    <HiOutlinePencilAlt size={14} />
                                    {kuisCount} Kuis
                                </span>
                            )}

                            <button
                                type="button"
                                aria-label="Lihat semua konten terkait"
                                className="ml-auto p-2 rounded-md hover:bg-neutral-800 text-neutral-300"
                                onClick={() => setIsRelatedOpen(true)}>
                                <HiOutlineChevronRight size={18} />
                            </button>
                        </div>
                        <div
                            ref={railRef}
                            className="flex items-center gap-4 overflow-hidden">
                            {visibleItems.map(
                                (
                                    { slug, category, title, book_cover_url },
                                    idx
                                ) => (
                                    <Link
                                        key={`${slug}-${idx}`}
                                        href={`${getBookBaseHref(
                                            category
                                        )}/${slug}`}
                                        className="relative w-[120px] h-[160px] flex-none rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800">
                                        <Image
                                            src={
                                                book_cover_url ||
                                                `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                                            }
                                            alt={title}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </Link>
                                )
                            )}

                            {remaining > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setIsRelatedOpen(true)}
                                    className="relative w-[120px] h-[160px] flex-none rounded-xl border border-neutral-700 bg-neutral-800/60 text-white">
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
                                        +{remaining}
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Modal with full list */}
                        <RelatedContentModal
                            open={isRelatedOpen}
                            onClose={() => setIsRelatedOpen(false)}
                            items={rawItems as Book[]}
                            bukuCount={bukuCount}
                            kuisCount={kuisCount}
                            isLoading={isLoadingCourse}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {isAuthenticated &&
                        is_subscribed &&
                        latest_watch_video?.subchapter.subchapter_name && (
                            <PercentageProgess slug={slug} />
                        )}
                    {is_subscribed && !isLoading ? (
                        latest_watch_video?.subchapter.subchapter_name ? (
                            <Button
                                className="w-full text-center"
                                variant="primary"
                                href={`/kelas/${slug}/${latest_watch_video?.subchapter.subchapter_slug}`}
                                eventName="Continue Learning Button on Course Landing Page"
                                eventPayload={{
                                    Position: 'HERO',
                                    'Course Slug': slug
                                }}>
                                Lanjut Belajar
                            </Button>
                        ) : (
                            <Button
                                className="w-full text-center"
                                variant="primary"
                                href={`/kelas/${slug}/${first_video_in_course?.subchapter_slug}`}
                                eventName="Start Learning Button on Course Landing Page"
                                eventPayload={{
                                    Position: 'RIGHT_SIDE',
                                    'Course Slug': slug
                                }}>
                                Mulai Belajar
                            </Button>
                        )
                    ) : (
                        <SubscribeButton slug={slug} className="w-full" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDescription;
