import useWindowSize from './useWindowSize';

type GradientWindowBreakpoints = {
    /**
     * window >= 1024px
     */
    isDesktopBreakpoints: boolean;
    /**
     * window >= 768 && width < 1024
     */
    isTabletBreakpoints: boolean;
    /**
     * window < 768
     */
    isMobileBreakpoints: boolean;
    isMediumMobileBreakpoints: boolean;
    isSmallMobileBreakpoints: boolean;
    isInFlatDesktopBreakpoints: boolean;
    checkCustomBreakpoints: (customBreakpoint: number) => boolean;
};

/**
 * Breakhpoint will be same with what we configure on tailwind and mui
 * NOTE: there are some breakpoint that adapted by how small the mobile screen size, not from tailwind/mui breakpoint
 * the following breakpoint is not from tailwind/mui
 * - mediumMobileBreakpints
 * - smallMobileBreakpoints
 */
const useWindowBreakpoints = (): GradientWindowBreakpoints => {
    const { width, height } = useWindowSize();

    const desktopBreakpoints = 1024;
    const tabletBreakpoints = 768;
    const mediumMobileBreakpints = 450;
    const smallMobileBreakpoints = 350;

    const isDesktopBreakpoints = width > desktopBreakpoints;
    const isTabletBreakpoints =
        width >= tabletBreakpoints && width < desktopBreakpoints;
    const isMobileBreakpoints = width < tabletBreakpoints;
    const isMediumMobileBreakpoints = width <= mediumMobileBreakpints;
    const isSmallMobileBreakpoints = width <= smallMobileBreakpoints;
    const isInFlatDesktopBreakpoints =
        width >= desktopBreakpoints && height <= tabletBreakpoints;

    const checkCustomBreakpoints = (customBreakpoint: number): boolean => {
        if (width >= customBreakpoint) {
            return false;
        }

        return true;
    };

    return {
        isDesktopBreakpoints,
        isTabletBreakpoints,
        isMobileBreakpoints,
        isMediumMobileBreakpoints,
        isSmallMobileBreakpoints,
        isInFlatDesktopBreakpoints,
        checkCustomBreakpoints
    };
};

export default useWindowBreakpoints;
