import { useState, useRef } from 'react';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import useOnScreen from 'src/commons/hooks/useOnScreen';

const Gallery = ({
    itemWidth = 24,
    itemCount = 5,
    items
}: {
    itemWidth: number;
    itemCount: number;
    items: JSX.Element[];
    row?: number;
}): JSX.Element => {
    const [translate, setTranslate] = useState(0);
    const firstRef = useRef({} as HTMLDivElement);
    const lastRef = useRef({} as HTMLDivElement);
    const isFirstOnViewPort = useOnScreen(firstRef);
    const isLastOnViewPort = useOnScreen(lastRef);
    return (
        <div className="relative">
            <div
                className={`w-screen pl-[7.25rem] transition ease-in-out relative`}
                style={{ transform: `translate(-${translate}rem)` }}>
                <div
                    className={`my-16 grid grid-rows-2 grid-flow-col gap-4 overflow-overflow-scroll`}>
                    <div ref={firstRef} />
                    <div />
                    {items}
                    <div ref={lastRef} />
                </div>
            </div>
            <button
                className={`${
                    isLastOnViewPort && 'hidden'
                } absolute right-16 bg-neutral-100 top-[40%] w-16 h-16 rounded-full flex justify-center items-center`}
                onClick={
                    translate < itemCount * itemWidth * 0.8
                        ? () => setTranslate(translate + itemWidth)
                        : undefined
                }
                disabled={isLastOnViewPort}>
                <MdChevronRight className="text-accent-purple text-5xl" />
            </button>
            <button
                className={`${
                    isFirstOnViewPort && 'hidden'
                } absolute left-16 bg-neutral-100 top-[40%] w-16 h-16 rounded-full flex justify-center items-center`}
                onClick={
                    translate > 0
                        ? () => setTranslate(translate - itemWidth)
                        : undefined
                }
                disabled={isFirstOnViewPort}>
                <MdChevronLeft className="text-accent-purple text-5xl" />
            </button>
        </div>
    );
};

export default Gallery;
