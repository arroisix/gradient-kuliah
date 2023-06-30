import LearnLayout from 'commons/learnLayout';
import KomunitasForm from 'komunitas/components/KomunitasForm';

const Komunitas = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <KomunitasForm />
        </LearnLayout>
    );
};

export default Komunitas;
