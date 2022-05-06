import { useState, useRef } from 'react';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import { useSwipeable } from 'react-swipeable';
import useOnScreen from 'commons/hooks/useOnScreen';
import useWindowSize from 'commons/hooks/useWindowSize';

const Gallery = ({
    itemWidth = 24,
    itemCount = 5,
    items
}: // row = 2
{
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
    const { width } = useWindowSize();
    const handlers = useSwipeable({
        onSwipedRight:
            translate > 0
                ? () => setTranslate(translate - itemWidth)
                : undefined,
        onSwipedLeft:
            translate < itemCount * itemWidth * 0.8
                ? () => setTranslate(translate + itemWidth)
                : undefined
    });

    // pl-4 md:pl-[7.25rem]
    return (
        <div className="relative overflow-hidden">
            <div
                className={`w-screen  transition ease-in relative`}
                style={{ transform: `translate(-${translate}rem)` }}
                {...handlers}>
                <div
                    className={`my-16 grid grid-rows-1 grid-flow-col gap-4 overflow-overflow-scroll`}>
                    <div ref={firstRef} />
                    <div />
                    {items}
                    <div ref={lastRef} />
                </div>
            </div>
            <button
                className={`${
                    (isLastOnViewPort || width <= 768) && 'hidden'
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
                    (isFirstOnViewPort || translate <= 0 || width <= 768) &&
                    'hidden'
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
