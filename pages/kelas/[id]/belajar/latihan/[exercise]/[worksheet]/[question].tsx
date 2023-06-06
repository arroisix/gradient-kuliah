import { useRouter } from 'next/router';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import LearnLayout from 'commons/learnLayout';
import { ExamProvider } from 'courses/contexts/ExamProvider';
import ExamLearnContainer from 'courses/containers/learn/exam';

const Belajar = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (id && !isAuthenticated) {
            router.push('/masuk');
        }
    }, [isAuthenticated, id]);

    return (
        <ExamProvider>
            <LearnLayout hideNavbar>
                <ExamLearnContainer />
            </LearnLayout>
        </ExamProvider>
    );
};

export default Belajar;
