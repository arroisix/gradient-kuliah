import LearnLayout from 'commons/learnLayout';
import KomunitasContainer from 'komunitas/containers';

const Komunitas = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <KomunitasContainer />
        </LearnLayout>
    );
};

export default Komunitas;
