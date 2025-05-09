import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DetailSection from 'komunitas/containers/DetailSection';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticProps, GetStaticPaths } from 'next';
import { QAPageJsonLd } from 'next-seo';
import moment from 'moment';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from 'redux/api/config';

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
        fallback: 'blocking' // can also be true or 'blocking'
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { category, id } = params as { category: string; id: string };

    try {
        // Make parallel API calls with axios
        const [postResponse, recommendationsResponse] = await Promise.all([
            axios.get<CommunityPostDetailResponse>(
                `${config.API_BASE_URL}communities/public/post/${id}/`
            ),
            axios.get<GetCommunityPostRecommendationResponse>(
                `${config.API_BASE_URL}learning-experiences/recommendations/communities/${id}/`
            )
        ]);

        const postData = postResponse.data;

        // Get comments after we have the post ID
        const commentResponse = await axios.get<
            CommunityPostCommentDetailResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            }
        >(`${config.API_BASE_URL}communities/post/${postData.id}/comment/`);

        const recommendations = recommendationsResponse.data;
        const commentData = commentResponse.data;

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
    } catch (error) {
        console.error('Error fetching community post:', error);
        return {
            notFound: true
        };
    }
};

DetailKomunitas.displayName = 'Community Detail';
export default withAnon(DetailKomunitas);
