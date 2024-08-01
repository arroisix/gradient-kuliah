import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import React, { useRef } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import TiptapViewer from './TiptapViewer';
import { getBookBaseHref } from 'courses/utils';
import Link from 'next/link';

type RelatedProblemsSectionProps = {
    title: string;
    problems?: ProblemRecommendation[];
    isLoading?: boolean;
} & PropsWithClassName;

const RelatedProblemsSection = ({
    title,
    problems,
    isLoading
}: RelatedProblemsSectionProps): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

    function scrollRight(): void {
        const SCROLL_CONSTANT = 240;
        if (ref?.current) {
            ref.current.scrollLeft += SCROLL_CONSTANT;
        }
    }

    function scrollLeft(): void {
        const SCROLL_CONSTANT = 240;
        if (ref?.current) {
            ref.current.scrollLeft -= SCROLL_CONSTANT;
        }
    }

    if (!isLoading && (!problems || problems?.length == 0)) return <></>;

    return (
        <div className="flex flex-col gap-5 py-4 md:gap-6">
            <div className="flex items-center justify-between">
                <h2 className="font-extrabold sm:text-sm md:text-lg">
                    {title}
                </h2>
                <div
                    className={cn(
                        'hidden gap-3 text-black',
                        problems && problems.length > 2 && 'md:flex'
                    )}>
                    <button
                        className="flex items-center justify-center w-8 h-8 text-2xl duration-200 bg-white rounded-full hover:bg-graphite-200"
                        onClick={scrollLeft}>
                        <MdOutlineChevronLeft size={24} />
                    </button>
                    <button
                        className="flex items-center justify-center w-8 h-8 text-2xl duration-200 bg-white rounded-full hover:bg-graphite-200"
                        onClick={scrollRight}>
                        <MdOutlineChevronRight size={24} />
                    </button>
                </div>
            </div>
            <div
                ref={ref}
                className="w-full overflow-x-scroll no-scrollbar snap-x scroll-smooth">
                <div className="flex flex-col w-full gap-4 md:w-max md:flex-row">
                    {isLoading && (
                        <Skeleton
                            repeat={5}
                            isCustomSize
                            className="w-full h-48 sm:w-80"
                        />
                    )}
                    {problems?.map((problem) => (
                        <Link
                            key={problem.problem_slug}
                            href={`${getBookBaseHref(problem.book_category)}/${
                                problem.book_slug
                            }/${problem.problem_slug}`}
                            className="w-full p-4 flex flex-col justify-between gap-3 border rounded-lg md:w-80 bg-[#222] border-graphite-600/50">
                            <TiptapViewer
                                content={problem.question_snippet}
                                className="text-sm font-semibold line-clamp-2"
                            />
                            <div className="flex items-end">
                                <p className="flex-1 text-sm text-graphite-400">
                                    {problem.book_title}
                                </p>
                                <div
                                    className={cn(
                                        'rounded-full text-xs flex-none w-fit text-white font-semibold px-3 py-1 bg-neutral-700',
                                        problem.book_category === 'Textbook' &&
                                            'bg-[#00B78B]',
                                        problem.book_category === 'Bank Soal' &&
                                            'bg-[#0083FF]'
                                    )}>
                                    {problem.book_category}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedProblemsSection;
