import { useRouter } from 'next/router';

import { RecommendationCard } from '../Report/Card/RecommendationCard';
import { useGetRecommendationMaterialFromProblemQuery } from 'exercises/redux/api/exercisesApi';
import CarouselSection from 'dashboard/components/CarouselSection';

const MaterialRecommendation = () => {
    const router = useRouter();
    const { slug, problemId } = router.query;
    const { data: materials } = useGetRecommendationMaterialFromProblemQuery(
        {
            slug: slug as string,
            problemId: problemId as string
        },
        { skip: !slug || !problemId }
    );

    if (!materials || materials.data.length <= 1) {
        return <div className="h-16" />;
    }

    return (
        <CarouselSection
            title="Rekomendasi Materi"
            items={materials.data}
            isLoading={false}
            titleClassName="text-white lg:text-2xl"
            itemsPerPage={4}
            renderItem={(material, index) => (
                <RecommendationCard key={index} material={material} />
            )}
            eventCategory="Material Recommendation"
        />
    );
};

export default MaterialRecommendation;
