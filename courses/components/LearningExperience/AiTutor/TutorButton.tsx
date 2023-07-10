import Copilot from 'commons/components/elements/Icons/Copilot';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { MouseEventHandler, useEffect, useState } from 'react';

interface TutorButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const TutorButton = ({ onClick }: TutorButtonProps): JSX.Element => {
    const [scrollY, setScrollY] = useState(0);
    const [lastScroll, setLastScroll] = useState(0);
    const [isScrollTop, setIsScrollTop] = useState(false);

    const { isMobileBreakpoints } = useWindowBreakpoints();

    useEffect(() => {
        function scrollListener(): void {
            setScrollY(window.scrollY);

            if (scrollY > lastScroll) {
                setIsScrollTop(false);
            } else if (scrollY < lastScroll) {
                setIsScrollTop(true);
            }

            setLastScroll(scrollY);
        }

        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        };
    }, [lastScroll, scrollY]);

    return (
        <>
            {(!isMobileBreakpoints || scrollY < 150 || isScrollTop) && (
                <button
                    onClick={onClick}
                    className="w-max flex justify-between items-center gap-[14px] md:gap-[10px] py-[9px] md:py-[6px] px-[14px] rounded-[100px] bg-accent-purple shadow-md cursor-pointer fadeinUp">
                    <h3 className="font-extrabold text-sm md:text-xs">
                        Bingung? tanya Copilot
                    </h3>
                    <Copilot />
                </button>
            )}
        </>
    );
};

export default TutorButton;
