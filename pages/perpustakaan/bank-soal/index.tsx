import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { GetStaticProps } from 'next';
import axios from 'axios';
import config from 'redux/api/config';

const BankSoalPage = ({
    books
}: {
    books: ListResponseData<Astronote>;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesEntrypoint
                title="Kumpulan Bank Soal Materi Perkuliahan"
                books={books}
            />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    try {
        const response = await axios.get<ListResponseData<Astronote>>(
            `${config.API_BASE_URL}books/v2/public/entrypoint/`,
            {
                params: {
                    limit: 6,
                    type: 'bank-soal'
                }
            }
        );

        const books = response.data;

        const META_TITLE = 'Kumpulan Bank Soal Perkuliahan Terbaru';
        const META_DESCRIPTION =
            'Kumpulan latihan soal terlengkap dengan pembahasan mendetail memberikan solusi yang mudah dipahami dan mulailah belajar dengan cara yang menyenangkan dan interaktif.';

        return {
            revalidate: 300,
            props: {
                books,
                canonical: 'https://gradient.academy/perpustakaan/bank-soal',
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
        console.error('Error fetching bank soal library data:', error);
        return {
            notFound: true
        };
    }
};

BankSoalPage.displayName = 'Question Bank Library';
export default BankSoalPage;
