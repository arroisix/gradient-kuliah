import { useRouter } from 'next/router';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import VideoLearnContainer from 'courses/containers/learn/video';
import { useEffect } from 'react';
import LearnLayout from 'commons/learnLayout';
import { AUTHENTICATION_ROUTE } from 'commons/constants';

const Belajar = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (id && !isAuthenticated) {
            router.push(AUTHENTICATION_ROUTE);
        }
    }, [isAuthenticated, id]);

    return (
        <LearningProvider>
            <LearnLayout>
                <VideoLearnContainer />
            </LearnLayout>
        </LearningProvider>
    );
};

export default Belajar;
