import React from 'react';
import AccordionVideo from './AccordionVideo';
import ListBooks from './ListBooks';
import SearchList from './SearchList';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import CodeEditor from '../CodeEditor';

type CourseDetailContentProps = {
    navigation: CourseDetailNavigation;
};

const CourseDetailContent = ({
    navigation
}: CourseDetailContentProps): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery({ slug: id as string }, { skip: !id });

    switch (navigation) {
        case 'VIDEO':
            return (
                <AccordionVideo
                    chapters={courseContent?.chapters as CourseChapter[]}
                    isLoading={isLoadingCourse}
                />
            );
        case 'BOOK':
            return (
                <ListBooks
                    books={courseContent?.books as Book[]}
                    isLoading={isLoadingCourse}
                />
            );
        case 'ON_SEARCH':
            return <SearchList />;
        case 'CODE EDITOR':
            return <CodeEditor />;
        default:
            return <></>;
    }
};

export default CourseDetailContent;
