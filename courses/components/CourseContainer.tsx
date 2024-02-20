import { GridProvider } from 'courses/contexts/GridProvider';
import { ReactNode } from 'react';

const CourseContainer = ({
    children
}: {
    children: ReactNode;
}): JSX.Element => {
    return (
        <GridProvider>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-1 lg:gap-4">
                {children}
            </div>
        </GridProvider>
    );
};

export default CourseContainer;
