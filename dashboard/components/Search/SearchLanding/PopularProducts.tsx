import { cn } from 'commons/utils';
import React, { PropsWithChildren, useRef } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';

type PopularProductsProps = {
    title: string;
} & PropsWithClassName;

const PopularProducts = ({
    title,
    className,
    children
}: PropsWithChildren<PopularProductsProps>): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

    const scrollRight = (): void => {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft += SCROLL_CONSTANT;
        }
    };

    const scrollLeft = (): void => {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft -= SCROLL_CONSTANT;
        }
    };

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex items-center justify-between">
                <h2 className="font-bold">{title}</h2>
                <div className={cn('hidden gap-3 text-black md:flex')}>
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
            <div ref={ref} className="relative gap-4 carousel carousel-center">
                {children}
            </div>
        </div>
    );
};

export default PopularProducts;
