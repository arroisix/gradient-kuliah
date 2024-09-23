import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DetailSection from 'komunitas/containers/DetailSection';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticProps, GetStaticPaths } from 'next';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import {
    getPublicCommunityPostDetail,
    getCommunityPostCommentDetail,
    getCommunityPostRecommendations
} from 'komunitas/redux/api/komunitasApi';
import { QAPageJsonLd } from 'next-seo';
import moment from 'moment';
import { useRouter } from 'next/router';

type DetailKomunitasProps = {
    postData: CommunityPostDetailResponse;
    commentData: CommunityPostCommentDetailResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
    recommendations: GetCommunityPostRecommendationResponse;
};

const DetailKomunitas = ({
    postData,
    commentData,
    recommendations
}: DetailKomunitasProps): JSX.Element => {
    const { asPath } = useRouter();
    const dummyComment = {
        id: '',
        content: '',
        comment_counts: 0,
        created_at: new Date(),
        student: {
            id: '',
            photo_url: '',
            username: '',
            is_expert: false
        }
    } as CommunityPostCommentDetail;
    const firstComment =
        commentData?.comments.length > 0
            ? commentData?.comments[0]
            : dummyComment;

    return (
        <>
            <KomunitasProvider initialDetailData={postData}>
                <LearnLayout showSidebar fullHeightSidebar>
                    <DetailSection
                        initialDetailData={postData}
                        recommendations={recommendations}
                    />
                </LearnLayout>
            </KomunitasProvider>

            <QAPageJsonLd
                mainEntity={{
                    name: postData?.content,
                    text: postData?.content,
                    answerCount: postData?.comment_counts,
                    upvoteCount: postData?.viewer_counts,
                    dateCreated: moment(new Date(postData?.created_at)).format(
                        'YYYY-MM-DD'
                    ),
                    url: `https://gradient.academy${asPath}`,
                    author: {
                        '@type': 'Person',
                        name: postData?.student.username
                    },
                    acceptedAnswer: {
                        name: firstComment.content,
                        text: firstComment.content,
                        dateCreated: moment(
                            new Date(firstComment.created_at)
                        ).format('YYYY-MM-DD'),
                        url: `https://gradient.academy${asPath}${
                            firstComment.id !== '' ? `#${firstComment.id}` : ''
                        }`,
                        author: {
                            '@type': 'Person',
                            name: firstComment.student.username
                        }
                    },
                    hasPart: {
                        '@type': 'WebPageElement',
                        cssSelector: `#${firstComment.id}`,
                        isAccessibleForFree: false
                    }
                }}
            />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true // can also be true or 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { category, id } = params as { category: string; id: string };
            const dispatch = store.dispatch as ThunkDispatch<
                RootState,
                never,
                never
            >;

            dispatch(getPublicCommunityPostDetail.initiate({ slug: id }));
            dispatch(getCommunityPostRecommendations.initiate({ slug: id }));

            const postPayload = await Promise.all(
                dispatch(getRunningQueriesThunk())
            );

            if (postPayload[0].error) {
                return {
                    notFound: true
                };
            }

            const postData = postPayload[0].data as CommunityPostDetailResponse;

            dispatch(
                getCommunityPostCommentDetail.initiate({ post_id: postData.id })
            );

            const commentPayload = await Promise.all(
                dispatch(getRunningQueriesThunk())
            );

            if (commentPayload[0].error) {
                return {
                    notFound: true
                };
            }

            const recommendations = postPayload[1].data ?? null;
            const commentData = commentPayload[0]
                .data as CommunityPostCommentDetailResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            };

            const META_TITLE =
                postData.content.length > 60
                    ? `${postData.content.substring(0, 60)} ...`
                    : postData.content;
            const META_DESCRIPTION =
                postData.content.length > 155
                    ? `${postData.content.substring(0, 155)} ...`
                    : postData.content;

            return {
                props: {
                    postData,
                    commentData,
                    recommendations,
                    canonical: `https://gradient.academy/komunitas/${category}/${id}`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/komunitas/${category}/${id}`,
                        images: [
                            {
                                url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                                width: 48,
                                height: 48,
                                alt: 'Gradient Academy'
                            }
                        ]
                    }
                },
                revalidate: 60 * 60 * 5 // 5 hours
            };
        }
);

DetailKomunitas.displayName = 'Community Detail';
export default withAnon(DetailKomunitas);
