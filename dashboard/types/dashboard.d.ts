interface StudentLearningProgress {
    course_slug: string;
    chapter_id: string;
    subchapter_id: string;
    subchapter_thumbnail: string;
    subchapter_name: string;
    course_name: string;
    progress_percentage: string;
}

interface StudentLearningProgressResponse {
    learning_progress: StudentLearningProgress[];
}

interface StudentCourse {
    course_slug: string;
    course_name: string;
}

interface StudentCourseResponse {
    courses: StudentCourse[];
}
