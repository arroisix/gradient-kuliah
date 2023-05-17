import Accordion from 'commons/components/elements/Accordion';
import Article from 'commons/components/elements/Icons/Article';
import Play from 'commons/components/elements/Icons/Play';
import {
    useGetListCourseChapterQuery,
    useGetListCourseSubChapterQuery
} from 'courses/redux/api/publicCourseApi';
import Link from 'next/link';

const SylabbusContent = ({
    id,
    slug
}: GradientBaseComponentWithId & { slug: string }): JSX.Element => {
    const { data: subchapters } = useGetListCourseSubChapterQuery(id);

    return (
        <div className="flex flex-col gap-2">
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
                        {subchapter.type_name === 'lecture' ? (
                            <Play />
                        ) : (
                            <Article />
                        )}
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
    const { data } = useGetListCourseChapterQuery(slug);

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
        </div>
    );
};

export default Sylabbus;
