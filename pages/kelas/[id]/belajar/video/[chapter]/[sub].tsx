import Layout from 'commons/layout';
import { useRouter } from 'next/router';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { useGetPublicCourseQuery } from 'courses/redux/api/publicCourseApi';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';
import withAuth from 'commons/withAuth';
import VideoLearnContainer from 'courses/containers/learn/video';
import { useEffect, useState } from 'react';

const Belajar = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const [fetch, setFetch] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: publicCourse } = useGetPublicCourseQuery(id as string, {
        skip: isAuthenticated || !fetch
    });
    const { data: privateCourse } = useGetPrivateCourseQuery(id as string, {
        skip: !isAuthenticated || !fetch
    });

    useEffect(() => {
        if (!fetch && id) {
            setFetch(true);
        }
    }, [id]);

    const getCourse = (): Course => {
        if (isAuthenticated) {
            return privateCourse ?? ({} as Course);
        }
        return publicCourse ?? ({} as Course);
    };

    return (
        <LearningProvider course={getCourse()} type="video">
            <Layout>
                <VideoLearnContainer course={getCourse()} />
            </Layout>
        </LearningProvider>
    );
};

export default withAuth(Belajar);
