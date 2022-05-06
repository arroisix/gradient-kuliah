import { ReactNode } from 'react';

const CourseContainer = ({
    children
}: {
    children: ReactNode;
}): JSX.Element => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2 lg:gap-4">
            {children}
        </div>
    );
};

export default CourseContainer;
