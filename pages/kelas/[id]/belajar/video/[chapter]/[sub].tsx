import { useRouter } from 'next/router';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { useGetLandingCourseListContentQuery } from 'courses/redux/api/publicCourseApi';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import VideoLearnContainer from 'courses/containers/learn/video';
import { useEffect, useState } from 'react';
import LearnLayout from 'commons/learnLayout';

const Belajar = (): JSX.Element => {
    const router = useRouter();
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
            router.push('/registrasi');
        }
    }, [isAuthenticated, id]);

    return (
        <LearningProvider>
            <LearnLayout>
                <VideoLearnContainer chapters={content?.data ?? []} />
            </LearnLayout>
        </LearningProvider>
    );
};

export default Belajar;
