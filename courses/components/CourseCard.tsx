import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import { useGrid } from 'courses/contexts/GridProvider';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, useEffect, useState } from 'react';

type CourseCardProps = {
    course: Course;
    latestSubChapter?: SubChapter;
    latestWatchProgress?: WatchProgress;
    isInGrid?: boolean;
    isFirstInGrid?: boolean;
    onClick?: () => void;
};

const CourseCard = forwardRef<HTMLDivElement, CourseCardProps>(({
    course,
    latestSubChapter,
    latestWatchProgress,
    isInGrid,
    isFirstInGrid,
    onClick,
}, ref): JSX.Element => {
    const router = useRouter();
    const loadingTransition = useTransition(router);

    useEffect(() => {
        if (course && !course.is_only_notebook)
            router.prefetch(`/kelas/${course.slug}`);
    }, [course]);

    const decideUrl = (): string => {
        if (course.is_only_notebook) {
            return `/kelas/${course.slug}/astronotes`;
        }

        return `/kelas/${course.slug}`;
    };

    const {cellRef, cellWidth} = useGrid();
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return (
        <Link href={decideUrl()} onClick={() => onClick?.()}>
            <div
                className={`relative flex items-end overflow-hidden rounded-lg cursor-pointer h-[300px] bg-neutral-800`}
                style={{
                    width: !isInGrid ? `${isSmallScreen ? cellWidth!-150 : cellWidth}px` : 'auto', // TODO: decrease 70px when it is less than sm
                    background: `url(${course.thumbnail}) center / cover no-repeat, #333333`,
                }}
                {...(isInGrid && isFirstInGrid ? {ref: cellRef} : {})}
            >
                <div className="bg-[#121212] w-full p-4">
                    {latestWatchProgress && (
                        !latestWatchProgress.is_finished ? (
                            <div className="flex items-center">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99961 14.3996C9.69699 14.3996 11.3249 13.7253 12.5251 12.5251C13.7253 11.3249 14.3996 9.69699 14.3996 7.99961C14.3996 6.30222 13.7253 4.67436 12.5251 3.47413C11.3249 2.27389 9.69699 1.59961 7.99961 1.59961C6.30222 1.59961 4.67436 2.27389 3.47413 3.47413C2.27389 4.67436 1.59961 6.30222 1.59961 7.99961C1.59961 9.69699 2.27389 11.3249 3.47413 12.5251C4.67436 13.7253 6.30222 14.3996 7.99961 14.3996ZM8.59961 3.99961C8.59961 3.84048 8.5364 3.68787 8.42387 3.57535C8.31135 3.46282 8.15874 3.39961 7.99961 3.39961C7.84048 3.39961 7.68787 3.46282 7.57535 3.57535C7.46282 3.68787 7.39961 3.84048 7.39961 3.99961V7.99961C7.39961 8.33081 7.66841 8.59961 7.99961 8.59961H11.1996C11.3587 8.59961 11.5114 8.5364 11.6239 8.42387C11.7364 8.31135 11.7996 8.15874 11.7996 7.99961C11.7996 7.84048 11.7364 7.68787 11.6239 7.57535C11.5114 7.46282 11.3587 7.39961 11.1996 7.39961H8.59961V3.99961Z" fill="#F2C04C"/>
                                </svg>
                                <p className="ml-2 text-xs text-[#F2C04C]">
                                    In Progress
                                </p> 
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99961 13.3996C8.69699 13.3996 10.3249 12.7253 11.5251 11.5251C12.7253 10.3249 13.3996 8.69699 13.3996 6.99961C13.3996 5.30222 12.7253 3.67436 11.5251 2.47413C10.3249 1.27389 8.69699 0.599609 6.99961 0.599609C5.30222 0.599609 3.67436 1.27389 2.47413 2.47413C1.27389 3.67436 0.599609 5.30222 0.599609 6.99961C0.599609 8.69699 1.27389 10.3249 2.47413 11.5251C3.67436 12.7253 5.30222 13.3996 6.99961 13.3996ZM10.0852 5.55241C10.1315 5.48864 10.1649 5.41637 10.1833 5.33972C10.2017 5.26308 10.2048 5.18356 10.1924 5.10571C10.1801 5.02785 10.1526 4.95319 10.1114 4.88598C10.0702 4.81878 10.0162 4.76034 9.95241 4.71401C9.88864 4.66768 9.81637 4.63436 9.73972 4.61596C9.66308 4.59756 9.58356 4.59444 9.50571 4.60677C9.42785 4.6191 9.35319 4.64665 9.28598 4.68783C9.21878 4.72902 9.16034 4.78304 9.11401 4.84681L6.32761 8.67881L4.82361 7.17481C4.76823 7.11753 4.70201 7.07185 4.62879 7.04044C4.55557 7.00903 4.47683 6.99252 4.39716 6.99186C4.3175 6.99121 4.2385 7.00643 4.16477 7.03663C4.09105 7.06683 4.02408 7.11142 3.96777 7.16778C3.91146 7.22414 3.86694 7.29115 3.83681 7.3649C3.80667 7.43866 3.79153 7.51767 3.79226 7.59734C3.79299 7.677 3.80958 7.75573 3.84106 7.82892C3.87254 7.9021 3.91828 7.96829 3.97561 8.02361L5.97561 10.0236C6.03691 10.0849 6.11078 10.1323 6.19213 10.1623C6.27347 10.1924 6.36037 10.2044 6.44682 10.1976C6.53327 10.1909 6.61723 10.1654 6.69291 10.1231C6.76859 10.0808 6.8342 10.0225 6.88521 9.95241L10.0852 5.55241Z" fill="#43B75D"/>
                                </svg>
                                <p className="ml-2 text-xs text-[#43B75D]">
                                    Completed
                                </p>
                            </div>
                        )
                    )}
                    <p className="mt-1 font-semibold">
                        {course.course_name}
                    </p>
                    {latestSubChapter && (
                        <p className="text-sm text-[#999999] mt-1">
                            Bab: {latestSubChapter.subchapter_name}
                        </p>
                    )}
                </div>
                {/* {course.is_coming_soon && (
                    <div
                        className="px-4 rounded-full py-1 absolute top-4 left-4 font-bold"
                        style={{
                            background: 'linear-gradient(90deg, #F2B04C 0%, #E4B50D 68.5%, #E48E0D 100%)'
                        }}
                    >
                        Segera hadir
                    </div>
                )} */}
                {course.is_new && (
                    <div className="bg-[#E9202A] px-4 rounded-full py-1 absolute top-4 left-4 font-bold">
                        Baru
                    </div>
                )}
            </div>
            {loadingTransition && <LoadingBackdrop />}
        </Link>
    );
});

export default CourseCard;
