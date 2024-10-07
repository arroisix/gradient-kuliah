import LearnLayout from 'commons/learnLayout';
import LatihanEntrypoint from '../../courses/containers/learn/latihan/entrypoint';

const LatihanPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <LatihanEntrypoint />
        </LearnLayout>
    );
};

LatihanPage.displayName = 'Latihan';
export default LatihanPage;
