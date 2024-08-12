import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';
import { getPublicListCoursesV2 } from 'courses/redux/api/publicCourseV2Api';
import { GetStaticProps } from 'next';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';

const ListClass = ({
    courses
}: {
    courses: ListResponseData<Course>;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <ClassContainer courses={courses} />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) => async () => {
        const dispatch = store.dispatch as ThunkDispatch<
            RootState,
            never,
            never
        >;

        dispatch(getPublicListCoursesV2.initiate({ page: 1, limit: 6 }));

        const [coursesResponse] = await Promise.all(
            dispatch(getRunningQueriesThunk())
        );

        const META_TITLE =
            'Kursus & Kelas Online Bersama Dosen Terbaik Indonesia';
        const META_DESCRIPTION =
            'Kursus online yang dirancang khusus untuk membantu kesuksesan akademik mahasiswa dalam proses belajar dan akan diajari langsung oleh dosen-dosen terbaik di Indonesia';

        return {
            props: {
                courses: coursesResponse.data,
                title: META_TITLE,
                description: META_DESCRIPTION,
                canonical: `https://gradient.academy/kelas`,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                            width: 48,
                            height: 48,
                            alt: 'Gradient Academy'
                        }
                    ]
                }
            },
            revalidate: 60
        };
    }
);

ListClass.displayName = 'Classes';
export default ListClass;
