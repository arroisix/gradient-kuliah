import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { getPublicEntrypointBooks } from 'courses/redux/api/astronotesApi';
import { GetStaticProps } from 'next';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';

const PerpustakaanPage = ({
    books
}: {
    books: ListResponseData<Astronote>;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesEntrypoint
                title="Perpustakaan Online Modul Perkuliahan"
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
        dispatch(getPublicEntrypointBooks.initiate({ limit: 6 }));
        const payload = await Promise.all(dispatch(getRunningQueriesThunk()));

        if (payload.some((response) => response.isError)) {
            return {
                notFound: true
            };
        }
        const books = payload[0].data as ListResponseData<Astronote>;

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
    }
);

PerpustakaanPage.displayName = 'Library';
export default PerpustakaanPage;
