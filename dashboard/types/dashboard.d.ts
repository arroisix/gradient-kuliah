interface StudentLearningProgress {
    course_slug: string;
    chapter_id: string;
    subchapter_id: string;
    subchapter_thumbnail: string;
    subchapter_name: string;
    subchapter_slug: string;
    course_name: string;
    progress_percentage: string;
}

interface StudentLearningProgressResponse {
    learning_progress: StudentLearningProgress[];
}

interface StudentCourse {
    course_slug: string;

    /* deprecated */
    course_name: string;
    name: string;
}

interface StudentCourseResponse {
    courses: StudentCourse[];
}

interface LearningMaterial {
    id: string;
    type: 'Video' | 'Textbook' | 'Astronotes' | 'Bank Soal';
    thumbnail: string;
    title: string;
    in_progress: boolean;
    course_slug: string;
    chapter_id: string;
    subchapter_id: string;
    subchapter_slug: string;
    book_slug: string;
    latest_page: number;
}

interface GetDashboardContentResponse {
    just_released: LearningMaterial[];
    book_recommendation: LearningMaterial[];
    class_recommendation: LearningMaterial[];
    my_class: StudentCourse[];
}

interface ClassProgress extends Omit<LearningMaterial, 'in_progress' | 'type'> {
    type: 'book' | 'textbook' | 'video' | 'bank_soal';
    latest_chapter: string;
    percentage_progress: number;
}
interface GetClassProgressResponse {
    class_progress: ClassProgress[];
}
