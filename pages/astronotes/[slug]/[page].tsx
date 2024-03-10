import { useThemeContext } from 'commons/contexts/ThemeProvider';
import LearnLayout from 'commons/learnLayout';
import Astronotes from 'courses/containers/learn/astronotes';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import config from 'redux/api/config';
import axios from 'axios';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from '@reduxjs/toolkit/dist';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import {
    getBookDetail,
    getPublicBookPreview
} from 'courses/redux/api/astronotesApi';
import { ArticleJsonLd } from 'next-seo';
import moment from 'moment';

const DUMMY_DATE = moment().startOf('year').format();

interface AstronotesPageProps {
    slug: string;
    page: number;
    book: GetBookDetailResponse['book'];
}

const AstroNotesPage = ({
    book,
    slug,
    page
}: AstronotesPageProps): JSX.Element => {
    const { theme } = useThemeContext();

    return (
        <>
            <ArticleJsonLd
                title={book?.title}
                description={`Perkaya ilmu mu dengan ${book?.title}`}
                authorName={[
                    {
                        name: 'Gradient Academy',
                        url: 'https://gradient.academy'
                    }
                ]}
                datePublished={DUMMY_DATE}
                url={`https://gradient.academy/astronotes/${slug}/${page}`}
                images={[
                    book?.cover_url,
                    'https://assets.gradient.academy/assets/gradient-G-icon.png'
                ]}
                isAccessibleForFree={page == 1}
            />
            <LearnLayout lightMode={theme === 'light'} showSubscriptionReminder>
                <Astronotes />
            </LearnLayout>
        </>
    );
};

AstroNotesPage.displayName = 'Books Reader';
export default AstroNotesPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<ListResponseData<string>>(
        `${config.API_BASE_URL}books/list-slug/`
    );

    const paths = response.data.map((slug) => ({
        params: { slug, page: '1' }
    }));

    return {
        paths,
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { slug, page } = params as { slug: string; page: string };
            (store.dispatch as ThunkDispatch<RootState, any, any>)(
                getPublicBookPreview.initiate({ slug })
            );
            (store.dispatch as ThunkDispatch<RootState, any, any>)(
                getBookDetail.initiate({ slug })
            );

            const payload = await Promise.all(
                (store.dispatch as ThunkDispatch<RootState, any, any>)(
                    getRunningQueriesThunk()
                )
            );

            if (payload[0].error || payload[1].error) {
                return {
                    notFound: true
                };
            }

            const book = (payload[1].data as GetBookDetailResponse).book;

            return {
                revalidate: 300,
                props: {
                    book,
                    slug,
                    page: parseInt(page),
                    canonical: `https://gradient.academy/astronotes/${slug}/${page}`,
                    title: book.title,
                    description: `Perkaya ilmu mu dengan ${book.title}`,
                    openGraph: {
                        type: 'website',
                        title: book.title,
                        description: `Perkaya ilmu mu dengan ${book.title}`,
                        url: `https://gradient.academy/astronotes/${slug}/${page}`,
                        images: [
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
