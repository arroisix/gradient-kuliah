import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';
import config from 'redux/api/config';
import { getBookDetail } from 'courses/redux/api/astronotesApi';
import { getRunningQueriesThunk } from 'redux/api/baseApi';

const BankSoalDetailPage = ({
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

BankSoalDetailPage.displayName = 'Question Bank Detail';
export default BankSoalDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<ListResponseData<string>>(
        `${config.API_BASE_URL}books/list-slug/`
    );

    const paths = response.data.flatMap((slug) => ({ params: { slug } }));

    return {
        paths,
        fallback: true
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
            if (data.book.category.toLowerCase() !== 'bank soal') {
                return {
                    notFound: true
                };
            }

            const META_TITLE = `${data.book.category} ${data.book.title.replace(
                'Bank Soal: ',
                ''
            )} Beserta Pembahasan | Gradient`;
            const META_DESCRIPTION = `Raih prestasi akademis lebih tinggi melalui soal-soal ${data.book.title.replace(
                'Bank Soal: ',
                ''
            )} berserta solusi lengkap untuk setiap pertanyaan yang akan mudah untuk Kamu pahami.`;

            return {
                revalidate: 300,
                props: {
                    slug: params?.slug,
                    astronotes: data.book,
                    canonical: `https://gradient.academy/perpustakaan/bank-soal/${params?.slug}`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/perpustakaan/bank-soal/${params?.slug}`,
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
                                alt: 'Gradient Academy'
                            }
                        ]
                    }
                }
            };
        }
);
