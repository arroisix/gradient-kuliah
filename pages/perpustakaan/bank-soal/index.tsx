import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { getPublicEntrypointBooks } from 'courses/redux/api/astronotesApi';
import { GetStaticProps } from 'next';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';

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

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) => async () => {
        const dispatch = store.dispatch as ThunkDispatch<
            RootState,
            never,
            never
        >;
        dispatch(
            getPublicEntrypointBooks.initiate({ limit: 6, type: 'bank-soal' })
        );
        const payload = await Promise.all(dispatch(getRunningQueriesThunk()));

        if (payload.some((response) => response.isError)) {
            return {
                notFound: true
            };
        }
        const books = payload[0].data as ListResponseData<Astronote>;

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
    }
);

BankSoalPage.displayName = 'Question Bank Library';
export default BankSoalPage;
