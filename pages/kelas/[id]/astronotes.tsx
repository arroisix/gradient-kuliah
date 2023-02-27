import { LearningProvider } from 'courses/contexts/LearningProvider';
import LearnLayout from 'commons/learnLayout';
import NotebookIndex from 'courses/containers/notebookIndex';

const AstroNotes = (): JSX.Element => {
    return (
        <LearningProvider>
            <LearnLayout>
                <NotebookIndex />
            </LearnLayout>
        </LearningProvider>
    );
};

export default AstroNotes;
