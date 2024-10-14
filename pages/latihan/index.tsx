import LearnLayout from 'commons/learnLayout';
import LatihanEntrypoint from 'courses/containers/learn/latihan/entrypoint';
import { GetStaticProps } from 'next';

const LatihanPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <LatihanEntrypoint />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE =
        'Try Out UTS dan UAS Online Materi Kuliah Bersama Gradient';
    const META_DESCRIPTION =
        'Try Out Latihan Soal yang dikurasi oleh Gradient agar kamu bisa belajar materi kuliah dengan mudah dan nyaman.';

    return {
        props: {
            title: META_TITLE,
            description: META_DESCRIPTION,
            canonical: `https://gradient.academy/latihan`,
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
        }
    };
};

LatihanPage.displayName = 'Latihan';
export default LatihanPage;
