import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import axios from 'axios';
import config from 'redux/api/config';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { Layout } from 'commons/components/Layout';

const TextbookDetailPage = ({
    slug,
    astronotes,
    recommendations
}: {
    slug: string;
    astronotes: BookDetailInterface;
    recommendations: GetBookRecommendationResponse;
}): JSX.Element => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <AstronotesDetail
                    slug={slug}
                    astronotes={astronotes}
                    recommendations={recommendations}
                />
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <div className={'m-4 lg:mx-12 lg:my-8'}>
                <AstronotesDetail
                    slug={slug}
                    astronotes={astronotes}
                    recommendations={recommendations}
                />
            </div>
        </Layout>
    );
};

TextbookDetailPage.displayName = 'Textbook Detail';
export default TextbookDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
        const { slug } = params as { slug: string };

        // Fetch book details and recommendations in parallel
        const [bookResponse, recommendationsResponse] = await Promise.all([
            axios.get<GetBookDetailResponse>(
                `${config.API_BASE_URL}books/${slug}/detail/`
            ),
            axios.get<GetBookRecommendationResponse>(
                `${config.API_BASE_URL}learning-experiences/recommendations/textbook/${slug}`
            )
        ]);

        const data = bookResponse.data;
        const recommendations = recommendationsResponse.data;

        if (data.book.category.toLowerCase() !== 'textbook') {
            return {
                notFound: true
            };
        }

        const authors = data.book.authors.join(', ');
        const META_TITLE = `Buku ${data.book.title} by ${authors}`;
        const META_DESCRIPTION = `Temukan kunci jawaban buku ${data.book.title} dari ${authors}, solusi dan pembahasan disusun mendalam oleh dosen-dosen ternama di Indonesia.`;

        return {
            revalidate: 300,
            props: {
                slug: params?.slug,
                astronotes: data.book,
                recommendations,
                canonical: `https://gradient.academy/perpustakaan/textbook/${params?.slug}`,
                title: META_TITLE,
                description: META_DESCRIPTION,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/perpustakaan/textbook/${params?.slug}`,
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
    } catch (error) {
        console.error('Error fetching textbook details:', error);
        return {
            notFound: true
        };
    }
};
