import Skeleton from 'commons/components/elements/Skeleton';
import { useGetCourseQuery } from 'courses/redux/api/courseApi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useTracker } from 'tracker/tracker';

const ClassCard = ({
    cover,
    title,
    description,
    slug,
    eventName,
    eventPayload
}: {
    cover: string;
    title: string;
    description: string;
    slug: string;
    eventName: string;
    eventPayload: { [key: string]: string };
}): JSX.Element => {
    const tracker = useTracker();

    return (
        <Link
            href={`/kelas/${slug}`}
            className="relative w-fit snap-center bg-[#5F2BCE33] rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => {
                tracker?.genericTrack(eventName, eventPayload);
            }}>
            <div className="relative w-[208px] h-[142px] md:h-[225px] md:w-[330px]">
                <Image
                    src={cover}
                    loading="lazy"
                    sizes="none"
                    layout="fill"
                    className="object-cover object-top"
                />
            </div>
            <div className="w-[200px] md:w-[330px] px-[18px] py-2 md:py-[14px]">
                <div className="flex items-center gap-1">
                    <h3 className="overflow-hidden text-xs font-extrabold md:text-lg whitespace-nowrap text-ellipsis">
                        {title}
                    </h3>
                    <FaChevronRight size={10} className="text-[#FFFFFF33]" />
                </div>
                <span className="inline-block font-medium text-[#FFFFFF80] text-[10px] md:text-base">
                    {description}
                </span>
            </div>
        </Link>
    );
};

const AnotherClass = (): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, isLoading } = useGetCourseQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            data: data?.courses.filter(({ slug }) => slug !== id),
            isLoading: isLoading
        })
    });

    function scrollRight(): void {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft += SCROLL_CONSTANT;
        }
    }

    function scrollLeft(): void {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft -= SCROLL_CONSTANT;
        }
    }

    return (
        <div className="flex flex-col gap-5 pt-8 md:gap-6">
            <div className="flex items-center justify-between px-5 md:px-16">
                <h2 className="text-sm font-extrabold md:text-lg">
                    Kelas Lainnya
                </h2>
                <div className="hidden gap-3 md:flex">
                    <FaChevronRight
                        size={20}
                        onClick={scrollLeft}
                        className="transition-all rotate-180 cursor-pointer text-neutral-500 hover:text-white"
                    />
                    <FaChevronRight
                        size={20}
                        onClick={scrollRight}
                        className="transition-all cursor-pointer text-neutral-500 hover:text-white"
                    />
                </div>
            </div>
            <div
                ref={ref}
                className="w-full px-5 overflow-x-scroll snap-x body scroll-smooth md:px-16">
                <div className="w-max mx-auto flex gap-[18px] md:gap-7">
                    {isLoading && (
                        <Skeleton
                            repeat={3}
                            isCustomSize
                            className="w-[300px] h-[200px]"
                        />
                    )}
                    {data?.map(
                        (
                            { thumbnail, course_name, short_description, slug },
                            index
                        ) => (
                            <ClassCard
                                key={index}
                                cover={thumbnail}
                                title={course_name}
                                description={short_description}
                                slug={slug}
                                eventName="Click Other Class Card"
                                eventPayload={{
                                    'Course Slug': id,
                                    'Target Course Slug': slug
                                }}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnotherClass;
