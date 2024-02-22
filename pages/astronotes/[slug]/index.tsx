import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import { wrapper } from 'redux/store';
import { getBookDetail } from '../../../courses/redux/api/astronotesApi';
import { getRunningQueriesThunk } from '../../../redux/api/baseApi';
import { ThunkDispatch } from 'redux-thunk';

const AstronotesDetailPage = ({slug, astronotes}: {slug: string, astronotes: BookDetailInterface}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesDetail slug={slug} astronotes={astronotes} />
        </LearnLayout>
    );
};

AstronotesDetailPage.displayName = 'Book Detail';
export default AstronotesDetailPage;

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps((store) => async ({ params }) => {
        (store.dispatch as ThunkDispatch<RootState, any, any>)(
            getBookDetail.initiate({ slug: params?.slug as string })
        );

        const payload = await Promise.all(
            (store.dispatch as ThunkDispatch<RootState, any, any>)(
                getRunningQueriesThunk()
            )
        );

        if (payload[0].error) {
            return {
                notFound: true
            };
        }

        const data = payload[0].data as GetBookDetailResponse

        return {
            props: {
                slug: params?.slug,
                astronotes: data.book,
                title: `${data.book.title}`,
                description: `Perkaya ilmu mu dengan ${data.book.title}`,
                openGraph: {
                    type: 'website',
                    title: `${data.book.title}`,
                    description: `Perkaya ilmu mu dengan ${data.book.title}`,
                    url: `https://gradient.academy/astronotes/${params?.slug}`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                            width: 48,
                            height: 48,
                            alt: 'Gradient Logo'
                        }
                    ]
                },
            }
        };
    });
