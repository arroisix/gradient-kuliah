import { LearningProvider } from 'courses/contexts/LearningProvider';
import LearnLayout from 'commons/learnLayout';
import NotebookIndex from 'courses/containers/learn/astronotes';

const AstroNotes = (): JSX.Element => {
    return (
        <LearningProvider>
            <LearnLayout lightMode>
                <NotebookIndex />
            </LearnLayout>
        </LearningProvider>
    );
};

export default AstroNotes;
