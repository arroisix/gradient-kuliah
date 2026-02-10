import { useAuth } from 'authentication/contexts/AuthProvider';
import { MateriCard } from 'courses/components/utbk/MateriCard';

interface ChapterRecommendationProps {
    title: string;
    cover: string;
    tags: string;
    progress: number;
    course_slug: string;
    chapter_slug: string;
    subchapter_slug: string;
    subchapter_name: string;
}

function CourseRecommendation({
    title,
    cover,
    tags,
    progress,
    course_slug,
    chapter_slug,
    subchapter_slug,
    subchapter_name
}: ChapterRecommendationProps): JSX.Element {
    const { profile } = useAuth();
    const trimmedTags = tags ? tags.split(',') : [];
    const href =
        profile?.current_role === 'COLLEGE_STUDENT'
            ? `/kelas/${course_slug}/${subchapter_slug}`
            : `/utbk/materi/${course_slug}/${chapter_slug}/${subchapter_slug}`;

    return (
        <div className="carousel-item w-full max-w-[440px]">
            <MateriCard
                isOpenNewTab
                href={href}
                course_name={title}
                cover={cover}
                tags={trimmedTags}
                latest_subchapter_name={subchapter_name}
                percentage_progress={progress}
                is_coming_soon={false}
            />
        </div>
    );
}

export { CourseRecommendation };
