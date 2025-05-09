import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import axios from 'axios';
import config from 'redux/api/config';

const BankSoalDetailPage = ({
    slug,
    astronotes,
    recommendations
}: {
    slug: string;
    astronotes: BookDetailInterface;
    recommendations: GetBookRecommendationResponse;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesDetail
                slug={slug}
                astronotes={astronotes}
                recommendations={recommendations}
            />
        </LearnLayout>
    );
};

BankSoalDetailPage.displayName = 'Question Bank Detail';
export default BankSoalDetailPage;

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
                `${config.API_BASE_URL}learning-experiences/recommendations/bank-soal/${slug}`
            )
        ]);

        const data = bookResponse.data;
        const recommendations = recommendationsResponse.data;

        if (data.book.category.toLowerCase() !== 'bank soal') {
            return {
                notFound: true
            };
        }

        const META_TITLE = `${data.book.title} Beserta Pembahasannya`;
        const META_DESCRIPTION = `Raih prestasi akademis lebih tinggi melalui latihan soal ${data.book.title} beserta solusi lengkap untuk setiap pertanyaan yang akan mudah untuk Kamu pahami.`;

        return {
            revalidate: 300,
            props: {
                slug: params?.slug,
                astronotes: data.book,
                recommendations,
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
    } catch (error) {
        console.error('Error fetching bank soal details:', error);
        return {
            notFound: true
        };
    }
};
