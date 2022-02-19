import { ReactNode } from 'react';

const CourseContainer = ({
    children
}: {
    children: ReactNode;
}): JSX.Element => {
    return <div className="w-full grid grid-cols-3 gap-4">{children}</div>;
};

export default CourseContainer;
