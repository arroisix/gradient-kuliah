import Skeleton from 'commons/components/elements/Skeleton';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

type PaginatorProps = {
    currentPage: number;
    totalPage: number;
    isLoading: boolean;
};

const Paginator = ({ totalPage, isLoading }: PaginatorProps): JSX.Element => {
    const router = useRouter();
    const { slug, page } = router.query;
    const MAX_VALUE = totalPage;
    const ref = useRef<HTMLDivElement>(null);
    const [isHoldClick, setIsHoldClick] = useState(false);

    function handleMouseDown(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        setIsHoldClick(true);
        handleMouse(event);
    }

    function handleMouseUp(): void {
        setIsHoldClick(false);
    }

    function handleMouseMove(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        if (isHoldClick) {
            handleMouse(event);
        }
    }

    function handleMouse(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        const clicked = event.pageX;
        const left = ref.current?.getBoundingClientRect().left || 0;
        const width = ref.current?.clientWidth || -1;
        const percent = ((clicked - left) / width) * 100;
        const multiple = MAX_VALUE / 100;
        const barValue = (percent * multiple).toFixed(0);

        router.push(
            `/astronotes/${slug}/${
                parseInt(barValue) < 1
                    ? 1
                    : parseInt(barValue) > MAX_VALUE
                    ? MAX_VALUE
                    : parseInt(barValue)
            }`
        );
    }

    function handlePrev(): void {
        router.push(`/astronotes/${slug}/${Number(page) - 1}`);
    }

    function handleNext(): void {
        router.push(`/astronotes/${slug}/${Number(page) + 1}`);
    }

    return (
        <div className="flex gap-6">
            <div
                className="relative flex items-center w-full px-2 pt-6 cursor-pointer"
                ref={ref}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                aria-hidden>
                <div className="absolute top-[50%] left-0 translate-y-[-50%] w-full h-[3px] bg-[#999999]" />
                <div
                    style={{ width: `${(Number(page) / totalPage) * 100}%` }}
                    className="absolute top-[50%] left-0 translate-y-[-50%] w-full h-[3px] bg-accent-purple"
                />
                <div
                    style={{ left: `${(Number(page) / totalPage) * 100}%` }}
                    className="absolute top-[50%] translate-y-[-50%] translate-x-[-50%] w-[10px] h-[10px] bg-accent-purple rounded-full"
                />
            </div>
            <div className="flex items-center gap-[10px]">
                <FaChevronRight
                    size={12}
                    className="text-[#666666] hover:text-black dark:hover:text-white rotate-180 cursor-pointer transition-all"
                    onClick={handlePrev}
                />
                <span className="inline-block text-xs select-none font-body">
                    {isLoading ? (
                        <Skeleton className="h-5 w-6 p-0 !m-0" />
                    ) : (
                        `${page}/${MAX_VALUE}`
                    )}
                </span>
                <FaChevronRight
                    size={12}
                    className="text-[#666666] hover:text-black dark:hover:text-white cursor-pointer transition-all"
                    onClick={handleNext}
                />
            </div>
        </div>
    );
};

export default Paginator;
