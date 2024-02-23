import { cn } from 'commons/utils';
import { useGrid } from 'courses/contexts/GridProvider';
import { ReactNode } from 'react';

const CourseContainer = ({
    children,
    isGrid
}: {
    children: ReactNode;
    isGrid?: boolean;
}): JSX.Element => {
    const { screenWidth } = useGrid();

    return (
        <div
            className={cn(
                'w-full',
                isGrid
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-1 lg:gap-4'
                    : 'flex justify-center'
            )}
            style={{
                gridTemplateColumns:
                    screenWidth! > 1500
                        ? 'repeat(auto-fit, minmax(354px, 1fr))'
                        : undefined
            }}>
            {children}
        </div>
    );
};

export default CourseContainer;
