import Skeleton from 'commons/components/elements/Skeleton';
import { useGetCourseQuery } from 'courses/redux/api/courseApi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const ClassCard = ({
    cover,
    title,
    description,
    slug
}: {
    cover: string;
    title: string;
    description: string;
    slug: string;
}): JSX.Element => {
    const router = useRouter();

    return (
        <div
            className="relative w-fit snap-center bg-[#5F2BCE33] rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/kelas/${slug}`)}
            aria-hidden>
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
                    <span className="inline-block font-extrabold text-xs md:text-lg whitespace-nowrap text-ellipsis overflow-hidden">
                        {title}
                    </span>
                    <FaChevronRight size={10} className="text-[#FFFFFF33]" />
                </div>
                <span className="inline-block font-medium text-[#FFFFFF80] text-[10px] md:text-base">
                    {description}
                </span>
            </div>
        </div>
    );
};

const AnotherClass = (): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { id } = router.query;

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
        <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex justify-between items-center px-5 md:px-16">
                <span className="inline-block font-extrabold text-sm md:text-lg">
                    Kelas Lainnya
                </span>
                <div className="hidden md:flex gap-3">
                    <FaChevronRight
                        size={20}
                        onClick={scrollLeft}
                        className="text-neutral-500 hover:text-white rotate-180 cursor-pointer transition-all"
                    />
                    <FaChevronRight
                        size={20}
                        onClick={scrollRight}
                        className="text-neutral-500 hover:text-white cursor-pointer transition-all"
                    />
                </div>
            </div>
            <div
                ref={ref}
                className="w-full overflow-x-scroll snap-x body scroll-smooth px-5 md:px-16">
                <div className="w-max mx-auto flex gap-[18px] md:gap-7">
                    {isLoading && (
                        <>
                            <Skeleton className="w-[300px] h-[200px]" />
                            <Skeleton className="w-[300px] h-[200px]" />
                            <Skeleton className="w-[300px] h-[200px]" />
                        </>
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
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnotherClass;
