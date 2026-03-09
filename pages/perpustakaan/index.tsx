import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import type { GetStaticProps } from 'next';
import axios from 'axios';
import config from 'redux/api/config';
import { Layout } from 'commons/components/Layout';
import { cn } from 'commons/utils';
import { useAuth } from 'authentication/contexts/AuthProvider';

const PerpustakaanPage = ({
    books
}: {
    books: ListResponseData<Astronote>;
}): JSX.Element => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <AstronotesEntrypoint
                    title="Perpustakaan Online Modul Perkuliahan"
                    books={books}
                />
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <AstronotesEntrypoint
                    title="Perpustakaan Online Modul Perkuliahan"
                    books={books}
                />
            </div>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    try {
        const response = await axios.get<ListResponseData<Astronote>>(
            `${config.API_BASE_URL}books/v2/public/entrypoint/`,
            {
                params: { limit: 6 }
            }
        );

        const books = response.data;

        const META_TITLE =
            'Perpustakaan Online Pusat Ruang Baca Digital Terkini';
        const META_DESCRIPTION =
            'Nikmati perpustakaan digital dengan akses tanpa batas ke buku, catatan, bank soal, dan solusi terbaik. Temukan semua yang Kamu butuhkan untuk belajar lebih baik.';

        return {
            props: {
                books,
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
    } catch (error) {
        console.error('Error fetching perpustakaan data:', error);
        return {
            revalidate: 30,
            notFound: true
        };
    }
};

PerpustakaanPage.displayName = 'Library';
export default PerpustakaanPage;
