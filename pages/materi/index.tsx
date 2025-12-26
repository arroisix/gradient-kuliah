import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import { GetStaticProps } from 'next';

const Materi = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <h1 className="text-white text-center font-bold text-2xl">
                Coming Soon
            </h1>
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/materi'
        }
    };
};

Materi.displayName = 'Materi';
export default withAnon(Materi);
