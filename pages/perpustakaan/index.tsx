import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { GetStaticProps } from 'next';

const PerpustakaanPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesEntrypoint />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE =
        'Perpustakaan Online Pusat Ruang Baca Digital Terkini | Gradient';
    const META_DESCRIPTION =
        'Nikmati perpustakaan digital dengan akses tanpa batas ke buku, catatan, bank soal, dan solusi terbaik. Temukan semua yang Kamu butuhkan untuk belajar lebih baik.';

    return {
        props: {
            canonical: 'https://gradient.academy/perpustakaan',
            title: META_TITLE,
            description: META_DESCRIPTION,
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

PerpustakaanPage.displayName = 'Library';
export default PerpustakaanPage;
