import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { getPublicCommunityPost } from 'komunitas/redux/api/komunitasApi';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ThunkDispatch } from 'redux-thunk';
import config from 'redux/api/config';
import { wrapper } from 'redux/store';
import { getRunningQueriesThunk } from 'redux/api/baseApi';

type KomunitasProps = {
    data: CommunityPostResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
};

const KomunitasByCategory = ({ data }: KomunitasProps): JSX.Element => {
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    return isLandingPageRevampOn ? (
        <KomunitasProvider initialData={data}>
            <LearnLayout showSidebar fullHeightSidebar showSubscriptionReminder>
                <KomunitasContainer initialData={data} />
            </LearnLayout>
        </KomunitasProvider>
    ) : (
        <></>
    );
};

KomunitasByCategory.displayName = 'Community By Category Explore';
export default withAnon(KomunitasByCategory);

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<SubjectCategoriesResponse>(
        `${config.API_BASE_URL}communities/public/subject-category/`
    );

    const paths = response.categories.flatMap(({ slug }) => ({
        params: { category: slug }
    }));

    return {
        paths,
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const category = params?.category as string;

            const { data: subjectCategoriesResponse } =
                await axios.get<SubjectCategoriesResponse>(
                    `${config.API_BASE_URL}communities/public/subject-category/`
                );

            const subjectCategoryIsExist =
                subjectCategoriesResponse.categories.some(
                    ({ slug }) => category === slug
                );

            if (!subjectCategoryIsExist) {
                const { data: categoryByPostSlugResponse } = await axios.get<{
                    subject_category_slug: string;
                }>(
                    `${config.API_BASE_URL}communities/public/subject-category/post/${category}/`
                );

                let redirectPathname = '/komunitas';
                const { subject_category_slug } = categoryByPostSlugResponse;
                if (subject_category_slug) {
                    redirectPathname = `/komunitas/${subject_category_slug}/${category}`;
                }

                return {
                    redirect: {
                        destination: redirectPathname,
                        permanent: true
                    }
                };
            }

            (store.dispatch as ThunkDispatch<RootState, never, never>)(
                getPublicCommunityPost.initiate({ category_slug: category })
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

            const data = payload[0].data as CommunityPostResponse & {
                count_items: number;
                next_page?: number;
                previous_page?: number;
            };

            const metaTitle =
                'Forum Diskusi Mahasiswa Tanya Jawab Pesoalan Kuliah';
            const metaDescription =
                'Temukan jawaban atas pertanyaan-pertanyaan dari materi kuliah serta saling bertukar informasi agar dapat meningkatkan pemahaman secara bersama-sama.';

            return {
                props: {
                    data,
                    canonical: `https://gradient.academy/komunitas/${category}`,
                    title: metaTitle,
                    description: metaDescription,
                    openGraph: {
                        type: 'website',
                        title: metaTitle,
                        description: metaDescription,
                        url: `https://gradient.academy/komunitas/${category}`,
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
                revalidate: 60
            };
        }
);
