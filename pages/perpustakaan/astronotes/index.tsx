import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { GetStaticProps } from 'next';
import axios from 'axios';
import config from 'redux/api/config';

const AstronotesPage = ({
    books
}: {
    books: ListResponseData<Astronote>;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesEntrypoint
                title="Catatan & Rangkuman Materi Kuliah"
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
                    type: 'astronotes'
                }
            }
        );

        const books = response.data;

        const META_TITLE = 'Kumpulan Rangkuman & Catatan Materi Kuliah';
        const META_DESCRIPTION =
            'Tingkatkan hasil belajar dari rangkuman & catatan berkualitas yang dirancang khusus agar lebih praktis serta mempercepat waktu Kamu dalam proses belajar.';

        return {
            revalidate: 300,
            props: {
                books,
                canonical: 'https://gradient.academy/perpustakaan/astronotes',
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
        console.error('Error fetching astronotes library data:', error);
        return {
            notFound: true
        };
    }
};

AstronotesPage.displayName = 'Astronotes Library';
export default AstronotesPage;
