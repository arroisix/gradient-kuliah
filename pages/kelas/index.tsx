import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';
import { GridProvider } from 'courses/contexts/GridProvider';
import { GetStaticProps } from 'next';

const ListClass = (): JSX.Element => {
    return (
        <GridProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <ClassContainer />
            </LearnLayout>
        </GridProvider>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            title: 'Kelas di Gradient',
            description:
                'Kelas yang disusun bersama dosen terbaik, demi kemudahan mahasiswa dalam mempelajari materi perkuliahan',
            openGraph: {
                type: 'website',
                title: 'Kelas di Gradient',
                description:
                    'Kelas yang disusun bersama dosen terbaik, demi kemudahan mahasiswa dalam mempelajari materi perkuliahan',
                url: `https://gradient.academy`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Logo'
                    }
                ]
            }
        },
        revalidate: 60
    };
};

ListClass.displayName = 'Classes';
export default ListClass;
