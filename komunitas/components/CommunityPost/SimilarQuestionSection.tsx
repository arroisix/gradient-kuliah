import { cn } from 'commons/utils';
import React, { useRef } from 'react';
import SimilarQuestion from './SimilarQuestion';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';

type SimilarQuestionSectionProps = {
    orientation?: 'horizontal' | 'vertical';
    questions: CommunityPostRecommendation[];
    title: string;
} & PropsWithClassName;

const SimilarQuestionSection = ({
    orientation = 'vertical',
    title,
    questions,
    className
}: SimilarQuestionSectionProps): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

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

    if (!questions || questions.length == 0) return <></>;

    return (
        <div
            className={cn(
                'relative w-screen md:w-full h-min bg-[#121212] -ml-4 md:m-0 p-4 md:p-5 md:rounded-lg',
                className
            )}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold sm:text-sm md:text-lg">
                    {title}
                </h2>
                <div
                    className={cn(
                        'hidden gap-3 text-black',
                        orientation === 'horizontal' &&
                            questions &&
                            questions.length > 3 &&
                            'md:flex'
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
                className={cn(
                    orientation === 'horizontal' &&
                        'w-full overflow-x-scroll no-scrollbar snap-x scroll-smooth'
                )}>
                <div
                    className={cn(
                        'flex flex-col gap-4',
                        orientation === 'horizontal' && 'md:flex-row'
                    )}>
                    {questions?.map((question) => (
                        <SimilarQuestion
                            key={question.id}
                            question={question}
                            className={cn(
                                orientation === 'horizontal' && 'md:w-80'
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimilarQuestionSection;
