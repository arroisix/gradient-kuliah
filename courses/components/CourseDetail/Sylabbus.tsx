import Accordion from 'commons/components/elements/Accordion';
import Article from 'commons/components/elements/Icons/Article';
import GreenCheck from 'commons/components/elements/Icons/GreenCheck';
import Play from 'commons/components/elements/Icons/Play';
import Skeleton from 'commons/components/elements/Skeleton';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import {
    useGetListCourseChapterQuery,
    useGetListCourseSubChapterQuery
} from 'courses/redux/api/publicCourseApi';
import Link from 'next/link';

const SylabbusContent = ({
    id,
    slug
}: GradientBaseComponentWithId & { slug: string }): JSX.Element => {
    const { data: subchapters, isLoading } =
        useGetListCourseSubChapterQuery(id);
    const { watch_progress } = useCourseSubscription(slug);

    return (
        <div className="flex flex-col gap-2">
            {isLoading && (
                <>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                </>
            )}
            {subchapters?.data.map((subchapter: SubChapter) => (
                <Link
                    key={subchapter.id}
                    href={
                        subchapter.type_name === 'lecture'
                            ? `/kelas/${slug}/belajar/video/${id}/${subchapter.id}`
                            : `/kelas/${slug}/astronotes`
                    }>
                    <button className="flex items-center gap-4 w-full relative">
                        <div className="h-[98px] min-w-[163px]">
                            <img
                                src={subchapter.thumbnail}
                                className="h-[98px] w-[163px] overflow-hidden rounded-lg object-cover"
                                alt="Video Thumbnail"
                            />
                        </div>
                        <div>
                            {subchapter.type_name === 'lecture' ? (
                                watch_progress?.filter(
                                    (progress: SubchapterProgress) =>
                                        progress?.subchapter?.id ===
                                            subchapter?.id &&
                                        progress?.video?.is_finished
                                )?.length ?? 0 > 0 ? (
                                    <GreenCheck />
                                ) : (
                                    <Play />
                                )
                            ) : (
                                <Article />
                            )}
                        </div>
                        <div className="flex flex-col text-left">
                            <p className="text-lg text-neutral-200">
                                {subchapter.subchapter_name}
                            </p>
                            <p className="text-lg text-neutral-600">
                                {subchapter.duration}
                            </p>
                        </div>
                        <span className="sr-only">
                            {subchapter.type_name === 'lecture'
                                ? `/kelas/${slug}/belajar/video/${id}/${subchapter.id}`
                                : `/kelas/${slug}/astronotes`}
                        </span>
                    </button>
                </Link>
            ))}
        </div>
    );
};

const Sylabbus = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    const { data, isLoading } = useGetListCourseChapterQuery(slug);

    return (
        <div className="px-5 w-screen flex flex-col lg:w-5/12">
            <Accordion
                item={
                    data?.data.map((chapter: Chapter) => ({
                        title: chapter.chapter_name,
                        jsxContent: (
                            <SylabbusContent id={chapter.id} slug={slug} />
                        )
                    })) ?? []
                }
            />
            {isLoading && (
                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                </div>
            )}
        </div>
    );
};

export default Sylabbus;
