import { CopilotContentRecommendation } from 'copilot/types/copilot';
import { SubchapterRecommendation } from './SubchapterRecommendation';
import { CourseRecommendation } from './CourseRecommendation';
import { useGetContentRecommendationDataQuery } from 'copilot/redux/api/copilotApi';
import LatihanCard from 'exercises/components/Entrypoint/LatihanCard';
import { ChapterRecommendation } from './ChapterRecommendation';

interface ContentRecommendationsProps {
    isForModal?: boolean;
    content_recommendations: CopilotContentRecommendation[];
}

function ContentRecommendations({
    isForModal = false,
    content_recommendations
}: ContentRecommendationsProps): JSX.Element {
    const hasManyRecommendation = content_recommendations?.length > 1;
    const isAllTryoutRecommendations = content_recommendations?.every(
        (v) => v.type === 'tryout'
    );

    const query_data = content_recommendations
        ?.map((v) => `${v.slug}_${v.type}`)
        .join(',');

    const { data: contentRecommendationRes, isLoading } =
        useGetContentRecommendationDataQuery(
            { data: query_data ?? '' },
            { skip: !query_data }
        );

    if (isLoading) {
        return (
            <>
                <div className="carousel-item animate-pulse bg-[#333333] w-[177px] h-[119px] rounded-lg"></div>
                <div className="carousel-item animate-pulse bg-[#333333] w-[177px] h-[119px] rounded-lg"></div>
                <div className="carousel-item animate-pulse bg-[#333333] w-[177px] h-[119px] rounded-lg"></div>
            </>
        );
    }

    if (isAllTryoutRecommendations) {
        return (
            <>
                {contentRecommendationRes?.data.map((v) => (
                    <div
                        key={v.slug}
                        className="carousel-item self-stretch w-full max-w-[328px]">
                        <LatihanCard
                            isOpenNewTab
                            cardType="allExercises"
                            exercise={{
                                icon: '',
                                id: '',
                                is_free: !!v.is_free,
                                slug: v.slug,
                                subject: '',
                                title: v.title,
                                total_questions: v.total_questions ?? 0,
                                closes_at: v.closes_at,
                                duration: v.duration,
                                exercise_code: v.exercise_code,
                                is_auto_irt_scoring_enabled:
                                    v.is_auto_irt_scoring_enable,
                                is_time_expired: v.is_time_expired,
                                opens_at: v.opens_at,
                                progress: v.progress,
                                progress_percentage: v.progress_percentage,
                                score: v.score,
                                score_published_at: v.score_published_at,
                                status: v.status,
                                tryout_type: v.tryout_type,
                                type: 'TRYOUT',
                                university_color: v.university_color,
                                university_name: v.university_name
                            }}
                        />
                    </div>
                ))}
            </>
        );
    }

    if (
        hasManyRecommendation ||
        content_recommendations[0].type === 'chapter'
    ) {
        return (
            <>
                {contentRecommendationRes?.data.map((v) => (
                    <ChapterRecommendation
                        key={v.slug}
                        type={v.type}
                        title={v.title}
                        course_slug={v.course_slug ?? ''}
                        chapter_slug={v.chapter_slug ?? ''}
                        subchapter_slug={v.subchapter_slug ?? ''}
                    />
                ))}
            </>
        );
    }

    if (content_recommendations[0].type === 'course') {
        return (
            <>
                {contentRecommendationRes?.data.map((v) => (
                    <CourseRecommendation
                        key={v.slug}
                        title={v.title}
                        cover={v.cover ?? ''}
                        tags={v.tags ? v.tags.replace(/\s/g, '') : ''}
                        progress={v.progress ?? 0}
                        course_slug={v.course_slug ?? ''}
                        chapter_slug={v.chapter_slug ?? ''}
                        subchapter_slug={v.subchapter_slug ?? ''}
                        subchapter_name={v.subchapter_name ?? ''}
                    />
                ))}
            </>
        );
    }

    return (
        <>
            {contentRecommendationRes?.data.map((v) => (
                <SubchapterRecommendation
                    key={v.slug}
                    isForModal={isForModal}
                    type={v.type}
                    title={v.title}
                    course_slug={v.course_slug ?? ''}
                    chapter_slug={v.chapter_slug ?? ''}
                    subchapter_slug={v.subchapter_slug ?? ''}
                    video_duration={v.video_duration}
                />
            ))}
        </>
    );
}

export { ContentRecommendations };
