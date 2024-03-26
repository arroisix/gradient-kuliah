import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import { wrapper } from 'redux/store';
import { getBookDetail } from '../../../courses/redux/api/astronotesApi';
import { getRunningQueriesThunk } from '../../../redux/api/baseApi';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';
import config from 'redux/api/config';

const AstronotesDetailPage = ({
    slug,
    astronotes
}: {
    slug: string;
    astronotes: BookDetailInterface;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesDetail slug={slug} astronotes={astronotes} />
        </LearnLayout>
    );
};

AstronotesDetailPage.displayName = 'Book Detail';
export default AstronotesDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<ListResponseData<string>>(
        `${config.API_BASE_URL}books/list-slug/`
    );

    const paths = response.data.flatMap((slug) => ({ params: { slug } }));

    return {
        paths,
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            (store.dispatch as ThunkDispatch<RootState, never, never>)(
                getBookDetail.initiate({ slug: params?.slug as string })
            );

            const payload = await Promise.all(
                (store.dispatch as ThunkDispatch<RootState, never, never>)(
                    getRunningQueriesThunk()
                )
            );

            if (payload[0].error) {
                return {
                    notFound: true
                };
            }

            const data = payload[0].data as GetBookDetailResponse;

            return {
                props: {
                    slug: params?.slug,
                    astronotes: data.book,
                    canonical: `https://gradient.academy/astronotes/${params?.slug}`,
                    title: `${data.book.category} ${data.book.title} | Catatan, Rangkuman dan Bank Soal`,
                    description: `Belajar dan Paham dengan baca ${data.book.category} ${data.book.title} hanya di Gradient`,
                    openGraph: {
                        type: 'website',
                        title: `${data.book.category} ${data.book.title} | Catatan, Rangkuman dan Bank Soal`,
                        description: `Belajar dan Paham dengan baca ${data.book.category} ${data.book.title} hanya di Gradient`,
                        url: `https://gradient.academy/astronotes/${params?.slug}`,
                        images: [
                            {
                                url: data.book.cover_url,
                                width: 162,
                                height: 232,
                                alt: `${data.book.category} ${data.book.title}`
                            },
                            {
                                url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                                width: 48,
                                height: 48,
                                alt: 'Gradient Logo'
                            }
                        ]
                    }
                }
            };
        }
);
