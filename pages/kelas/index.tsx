import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';
import { GetStaticProps } from 'next';

const ListClass = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <ClassContainer />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const META_TITLE =
        'Kursus & Kelas Online Bersama Dosen Terbaik Indonesia | Gradient';
    const META_DESCRIPTION =
        'Kursus online yang dirancang khusus untuk membantu kesuksesan akademik mahasiswa dalam proses belajar dan akan diajari langsung oleh dosen-dosen terbaik di Indonesia';

    return {
        props: {
            title: META_TITLE,
            description: META_DESCRIPTION,
            canonical: `https://gradient.academy/kelas`,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: `https://gradient.academy`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Academy'
                    }
                ]
            }
        },
        revalidate: 60
    };
};

ListClass.displayName = 'Classes';
export default ListClass;
