import Layout from 'commons/layout';
import ClassContainer from 'courses/containers';
import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';

const Kelas = (): JSX.Element => {
    const { data: courses } = useGetPublicListCoursesQuery(
        {} as FilterCourseQueryParams
    );

    return (
        <Layout courses={courses?.data}>
            <ClassContainer courses={courses?.data ?? []} />
        </Layout>
    );
};

export default Kelas;
