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
    type: 'Video' | 'Textbook' | 'Astronotes' | 'Bank Soal' | 'Kelas';
    thumbnail: string;
    title: string;
    in_progress: boolean;
    course_slug: string;
    chapter_id: string;
    subchapter_id: string;
    subchapter_slug: string;
    book_slug: string;
    latest_page: number;
    latest_problem: string;
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

interface PaginatedResponse<T> {
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
    data: T[];
}

// User Classes
interface UserClass {
    id: string;
    course_slug: string;
    course_name: string;
    subchapter_slug: string;
    subchapter_name: string;
    thumbnail: string;
    progress_percentage: number;
}

type UserClassesResponse = PaginatedResponse<UserClass>;

// User Books
interface UserBook {
    id: string;
    book_title: string;
    book_slug: string;
    cover_url: string;
    type: 'bank_soal' | 'textbook' | 'astronotes';
    course_name: string;
    progress_percentage: number;
    latest_page: string;
    latest_problem: string;
    latest_chapter: string;
}

type UserBooksResponse = PaginatedResponse<UserBook>;

// User Flashcards
interface UserFlashcard {
    id: string;
    title: string;
    slug: string;
    course_name: string;
    card_count: number;
    total_questions: string;
    progress_percentage: number;
    created_by: string;
    photo_profile: string;
}

type UserFlashcardsResponse = PaginatedResponse<UserFlashcard>;

// User Quiz
interface UserQuiz {
    slug: string;
    title: string;
    course_name: string;
    problem_count: string;
    progress_percentage: string;
    total_questions: number;
}

interface UserQuizResponse {
    data: UserQuiz[];
}

export interface Banner {
    slug: string;
    type: 'GENERAL' | 'PROMO' | 'SUBSCRIPTION' | 'ACCOUNT';
    href: string | null;
    is_asset: boolean;
    banner_url: string | null;
    banner_url_mobile: string | null;
    title_text: string | null;
    body_text: string | null;
    button_text: string | null;
    image_url: string | null;
    background_color: string | null;
}

export interface BannerResponse {
    data: Banner[];
}

interface MajorClass {
    course_slug: string;
    course_name: string;
    thumbnail: string;
}

interface MajorClassesResponse {
    major: string;
    data: MajorClass[];
}

type ContentType =
    | 'video'
    | 'textbook'
    | 'bank_soal'
    | 'astronotes'
    | 'quiz'
    | 'flashcard';

interface BaseMajorRecommendationItem {
    type: ContentType;
    id: string;
    thumbnail: string;
}

interface VideoRecommendationItem extends BaseMajorRecommendationItem {
    type: 'video';
    course_name: string;
    course_slug: string;
    subchapter_name: string;
    subchapter_slug: string;
}

interface BookRecommendationItem extends BaseMajorRecommendationItem {
    type: 'textbook' | 'bank_soal' | 'astronotes';
    book_title: string;
    page_title: string;
    book_slug: string;
    course_name: string;
    page_number: number;
}

interface QuizRecommendationItem extends BaseMajorRecommendationItem {
    type: 'quiz';
    title: string;
    slug: string;
    course_name: string;
    total_questions: string;
}

interface FlashcardRecommendationItem extends BaseMajorRecommendationItem {
    type: 'flashcard';
    title: string;
    slug: string;
    course_name: string;
    card_count: string;
    created_by: string;
}

type MajorRecommendationItem =
    | VideoRecommendationItem
    | BookRecommendationItem
    | QuizRecommendationItem
    | FlashcardRecommendationItem;

interface MajorRecommendationResponse {
    major: string;
    data: MajorRecommendationItem[];
}

interface CourseRecommendation {
    course_name: string;
    recommendations: MajorRecommendationItem[];
}

interface LearnRecommendationResponse {
    data: CourseRecommendation[];
}

export interface NewlyReleasedForYouItem {
    id: string;
    slug: string | null;
    type: string;
    title: string | null;
    course_name: string | null;
    course_slug: string | null;
    thumbnail: string | null;
    book_title: string | null;
    book_slug: string | null;
    chapter_name: string | null;
    subchapter_name: string | null;
    subchapter_slug: string | null;
    problem_title: string | null;
    problem_slug: string | null;
    page_title: string | null;
    page_number: number | null;
    total_questions: number | null;
    card_count: number | null;
    created_by: string | null;
    photo_profile: string | null;
}

export interface NewlyReleasedForYouResponse {
    count_items: number;
    previous_page: number | null;
    next_page: number | null;
    data: NewlyReleasedForYouItem[];
}

export interface MajorBookItem {
    id: string;
    slug: string | null;
    type: string;
    title: string | null;
    course_name: string | null;
    course_slug: string | null;
    thumbnail: string | null;
    book_title: string | null;
    book_slug: string | null;
    chapter_name: string | null;
    subchapter_name: string | null;
    subchapter_slug: string | null;
    problem_title: string | null;
    problem_slug: string | null;
    page_title: string | null;
    page_number: number | null;
    total_questions: number | null;
    card_count: number | null;
    created_by: string | null;
    photo_profile: string | null;
    major: string | null;
}

export interface MajorBooksResponse {
    count_items: number;
    previous_page: number | null;
    next_page: number | null;
    data: MajorBookItem[];
    major: string | null;
}

export interface MajorFlashcardItem {
    id: string;
    slug: string | null;
    title: string | null;
    card_count: number | null;
    created_by: string | null;
    photo_profile: string | null;
}

export interface MajorFlashcardsResponse {
    count_items: number;
    previous_page: number | null;
    next_page: number | null;
    data: MajorFlashcardItem[];
}

export interface MajorQuizItem {
    id: string;
    slug: string;
    title: string;
    course_name: string;
    total_questions: number;
    progress_percentage: number;
}

export interface MajorQuizResponse {
    count_items: number;
    previous_page: number | null;
    next_page: number | null;
    data: MajorQuizItem[];
}

export type {
    StudentLearningProgress,
    StudentLearningProgressResponse,
    StudentCourse,
    StudentCourseResponse,
    LearningMaterial,
    GetDashboardContentResponse,
    ClassProgress,
    GetClassProgressResponse,
    PaginatedResponse,
    UserClass,
    UserClassesResponse,
    UserBook,
    UserBooksResponse,
    UserFlashcard,
    UserFlashcardsResponse,
    UserQuiz,
    UserQuizResponse,
    Banner,
    BannerResponse,
    MajorClass,
    MajorClassesResponse,
    ContentType,
    BaseMajorRecommendationItem,
    VideoRecommendationItem,
    BookRecommendationItem,
    QuizRecommendationItem,
    FlashcardRecommendationItem,
    MajorRecommendationItem,
    MajorRecommendationResponse,
    CourseRecommendation,
    LearnRecommendationResponse,
    NewlyReleasedForYouItem,
    NewlyReleasedForYouResponse,
    MajorBookItem,
    MajorBooksResponse,
    MajorFlashcardItem,
    MajorFlashcardsResponse,
    MajorQuizItem,
    MajorQuizResponse
};
