import Layout from 'commons/layout';
import { useRouter } from 'next/router';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { useGetLandingCourseListContentQuery } from 'courses/redux/api/publicCourseApi';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import VideoLearnContainer from 'courses/containers/learn/video';
import { useEffect, useState } from 'react';
import { useAuth } from 'authentication/contexts/AuthProvider';

const Belajar = (): JSX.Element => {
    const router = useRouter();
    const { setModalAuthOpen } = useAuth();
    const { id } = router.query;
    const [fetch, setFetch] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: content } = useGetLandingCourseListContentQuery(
        id as string,
        {
            skip: id === undefined || id === null
        }
    );

    useEffect(() => {
        if (!fetch && id) {
            setFetch(true);
        }
    }, [id]);

    useEffect(() => {
        if (id && !isAuthenticated) {
            setModalAuthOpen(1, true);
        }
    }, [isAuthenticated, id]);

    return (
        <LearningProvider chapters={content?.data ?? []} type="video">
            <Layout>
                <VideoLearnContainer chapters={content?.data ?? []} />
            </Layout>
        </LearningProvider>
    );
};

export default Belajar;
