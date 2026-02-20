import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { GetStaticProps } from 'next';
import axios from 'axios';
import config from 'redux/api/config';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { Layout } from 'commons/components/Layout';

const TextbookPage = ({
    books
}: {
    books: ListResponseData<Astronote>;
}): JSX.Element => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <AstronotesEntrypoint
                    title="Kumpulan Kunci Jawaban dari Buku Pembelajaran Kuliah"
                    books={books}
                />
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <div className="m-4 lg:mx-12 lg:my-8">
                <AstronotesEntrypoint
                    title="Kumpulan Kunci Jawaban dari Buku Pembelajaran Kuliah"
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
                params: {
                    limit: 6,
                    type: 'text-book'
                }
            }
        );

        const books = response.data;

        const META_TITLE =
            'Kumpulan Kunci Jawaban Buku Perkuliahan + Pembahasannya';
        const META_DESCRIPTION =
            'Dapatkan kunci jawaban beserta pembahasan solusi yang telah diverifikasi dosen ternama untuk semua buku perkuliahan. Solusi terbaik untuk setiap materi perkuliahan.';

        return {
            revalidate: 300,
            props: {
                books,
                canonical: 'https://gradient.academy/perpustakaan/textbook',
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
        console.error('Error fetching textbook library data:', error);
        return {
            notFound: true
        };
    }
};

TextbookPage.displayName = 'Textbook Library';
export default TextbookPage;
