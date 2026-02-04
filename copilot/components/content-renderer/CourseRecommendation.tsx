import { MateriCard } from 'courses/components/utbk/MateriCard';

interface CourseRecommendationProps {
    course: Course;
}

function CourseRecommendation({
    course
}: CourseRecommendationProps): JSX.Element {
    return (
        <div className="w-full max-w-[440px]">
            <MateriCard
                href={`/utbk/materi/${course.slug}/${course.latest_chapter_slug}/${course.latest_subchapter_slug}`}
                course_name={course.course_name}
                cover={course.cover}
                tags={course.tags}
                latest_subchapter_name={course.latest_subchapter_name}
                percentage_progress={course.percentage_progress}
                is_coming_soon={course.is_coming_soon}
            />
        </div>
    );
}

export { CourseRecommendation };
