import { LearningProvider } from 'courses/contexts/LearningProvider';
import VideoLearnContainer from 'courses/containers/learn/video';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';

const Belajar = (): JSX.Element => {
    return (
        <LearningProvider>
            <LearnLayout>
                <VideoLearnContainer />
            </LearnLayout>
        </LearningProvider>
    );
};

Belajar.displayName = 'Watch Video';
export default withAnon(Belajar);
