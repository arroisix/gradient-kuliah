type ProgressType = 'VIDEO' | 'NOTEBOOK' | 'EXERCISE';

interface FilterCourseQueryParams {
    page?: int;
    limit?: int;
    is_subscribed?: boolean;
    keyword?: string;
    major?: string;
    section?: string;
    sort?: string;
    search?: string;
    type?: 'COLLEGE' | 'UTBK';
}

interface TrackSubchapterProgressInputData {
    learning_progress_id: string;
    video_progress?: {
        video_id: string;
        last_duration: string;
        is_finished: boolean;
    };
}

interface PopupQuestionAnswerInputData {
    popup_question_id: string;
    popup_answer_id: string[];
}

interface PopupQuestionAnswerResponseData {
    id: string;
    popup_question: PopupQuestion;
    answers: ExerciseAnswer[];
    is_correct: boolean;
}

type Course = {
    id: string;
    course_name: string;
    trailer: string;
    short_description: string;
    is_subscribed: boolean;
    description: string;
    chapters: Chapter[];
    banner: string;
    cover: string;
    thumbnail: string;
    lecturers: Lecturer[];
    learning_progress?: LearningProgress;
    comingSoon?: boolean;
    slug: string;
    price?: number;
    discount?: number;
    is_coming_soon?: boolean;
    is_new?: boolean;
    is_only_notebook?: boolean;
    is_free?: boolean;
    tags?: string[];
    latest_chapter_name?: string;
    latest_chapter_slug?: string;
    latest_subchapter_name?: string;
    latest_subchapter_slug?: string;
    percentage_progress?: number;
};

// type SubChapter = {
//     id: string;
//     subchapter_name: string;
//     type_name: string;
//     thumbnail: string;
//     order: number;
// }

type WatchProgress = {
    id: string;
    last_duration: number;
    total_watch_duration: number;
    is_finished: boolean;
};

type Lecturer = {
    id: string;
    name: string;
    photo: string;
    role: string;
};

type SubChapter = {
    id: string;
    chapter_id?: string;
    chapter_name?: string;
    subchapter_name?: string;
    subchapter_slug?: string;
    thumbnail?: string;
    order: number;
    video?: Video;
    notebook?: Notebook;
    exercise?: CourseExercise;
    exercises?: CourseExercise[];
    type_name?: 'lecture' | 'notebook' | 'exercise';
    duration?: string;
    last_duration?: string | null;
    is_finished?: boolean | null;
    is_free?: boolean | null;
    exercise_name?: string | null;
    is_on_progress?: boolean | null;
    type?: 'video' | 'exercise';
    packet_id?: string;
    prev_subchapter_slug?: string;
    next_chapter_slug?: string;
    next_subchapter_slug?: string;
    next_subchapter_name?: string;
    video_id?: string;
    created_at: Date;
    exercise_id?: string;
    title?: string;
    icon?: string;
    exercise_slug?: string;
    status?: 'IN_PROGRESS' | 'COMPLETED';
    minimum_score?: number;
    latest_score?: number;
    is_downloaded?: boolean;
};

type Chapter = {
    id: string;
    chapter_name: string;
    order: int;
    subchapters: SubChapter[];
    is_coming_soon_video: boolean;
    is_coming_soon_animation: boolean;
    is_coming_soon_notebook: boolean;
};

type NotebookSubSection<T> = {
    key: T;
    title: T;
    sections?: NotebookSubSection<T>[];
};

type Notebook = {
    id: string;
    is_free: boolean;
    is_public: boolean;
    notion_id: string;
    title: string;
    authors: Lecturer[];
    created_at: string | Date;
    notebook_url: string;
    subsection: { sections: NotebookSubSection[] };
    progress?: null;
    thumbnail?: string;
    book_slug?: string;
    page?: number;
};

interface VideoTranscript {
    order: number;
    content: string;
    duration: string;
}

type Video = {
    id: string;
    video_url: string;
    is_free: boolean;
    is_animation?: boolean;
    is_embed_youtube?: boolean;
    duration: string;
    thumbnail: string;
    description: string;
    lecturers?: Lecturer[];
    subchapter_id?: string;
    progress?: VideoProgress;
    popup_questions?: PopupQuestion[];
    ai_unique_id?: string;
    mux_playback_id?: string;
    token?: string;
    has_code_editor?: boolean;
    is_drm_protected?: boolean;
    drm_video_url?: string;
    drm_token?: string;
    transcript?: VideoTranscript[];
};

type CodeEditorTemplate = {
    id: string;
    code_template: string;
};

type CourseExercise = {
    id: string;
    packet_id: string;
    is_free: boolean;
    exercise_name: string;
    is_on_progress: boolean;
    is_finish: boolean;
    progress?: null;
    thumbnail?: string;
    slug?: string;
};

type PopupQuestion = {
    id: string;
    question: ExerciseQuestion;
};

type ExerciseAnswer = {
    id: string;
    answer: string;
    is_answer?: boolean;
};

type ExerciseQuestion = {
    id: string;
    question_name: string;
    question_image_url: string;
    question: string;
    solution?: string;
    solution_image_url?: string;
    answers: ExerciseAnswer[];
    type_name: 'multiple_choice' | 'multiple_answer' | 'short_answer';
};

type VideoProgress = {
    id: string;
    video: Video;
    last_duration: string;
    is_finished: boolean;
};

type SubchapterProgress = {
    id: string;
    chapter_id: string;
    latest_progress: ProgressType;
    video: VideoProgress;
    subchapter: SubChapter;
};

interface FirstVideoInCourse {
    subchapter_id: string;
    subchapter_name: string;
    subchapter_slug: string;
    chapter_id: string;
    chapter_name: string;
    is_free: boolean;
}

type CompletionPercentage = {
    total_finished_video: int;
    total_video_count: int;
    percentage_progress: number;
};

type LearningProgress = {
    id: string;
    first_video_in_course?: FirstVideoInCourse;
    latest_watch_video: SubchapterProgress;
    watch_progress: SubchapterProgress[];
    completion_percentage?: CompletionPercentage;
    total_duration?: number;
};

type CourseProgress = {
    id: string;
    course: Course;
    latest_subchapter: SubChapter;
    latest_watch_progress: WatchProgress;
};

type Packet = {
    id: string;
    is_free: boolean;
    packet_name: string;
    active_duration: number;
    is_lifetime: boolean;
    price: string;
    price_before_discount: string;
    discount: string;
    courses: Course[];
    benefits: {
        data: string[];
        info: string;
    };
};

interface NotebookSlugResponse {
    notionId: string;
    courseSlug: string;
}

type Course = {
    id: string;
    course_name: string;
    thumbnail: string;
    slug: string;
    short_description: string;
};

interface CoursesResponse {
    courses: Course[];
}

type CourseChapter = {
    chapter_id: string;
    chapter_slug: string;
    chapter_name: string;
    order: number;
    subchapter_counts?: number;
    is_finished?: boolean;
};

type Book = {
    book_id: string;
    title: string;
    rating: number;
    book_cover_url?: string | null;
    authors: string;
    slug: string;
    category: string;
};

interface CourseContentResponse {
    chapters: CourseChapter[];
    books: Book[];
}

interface SubchapterResponse {
    subchapters: SubChapter[];
}

interface SubchapterSearch {
    chapter: string;
    items: {
        id: string;
        subchapter_name: string;
        subchapter_slug: string;
        order: string;
        duration: string;
        last_duration: string;
        chapter_slug: string;
        type_name: 'lecture' | 'notebook' | 'exercise';
        is_finished: boolean;
        is_free: boolean;
    }[];
}

interface SearchInterface<T> {
    contents: T[];
    count_items: number;
    next_page?: number | null;
    previous_page?: number | null;
}

interface SearchCourseResponse {
    subchapters: SearchInterface<SubchapterSearch>;
    books: SearchInterface<Book>;
    chapters: SearchInterface<CourseChapter>;
}

type CourseDetail = {
    course_id: string;
    course_name: string;
    level: string;
    rating: number;
    total_books: number;
    is_free: boolean;
    lecturers: {
        name: string;
        role: string;
        photo: string;
    }[];
};

interface CourseDetailResponse {
    course_detail: CourseDetail;
}

interface CourseFeedback {
    content: string;
    rating: number;
}

interface BookChapter {
    id: string;
    title: string;
    notebook_url: string;
    notion_id: string;
    subsection: { sections: { key: string; title: string }[] };
    order: number;
}

interface BookContent {
    id: string;
    title: string;
    is_free: boolean;
    is_public: boolean;
    book_cover_url: string;
    rating: number;
    chapters: BookChapter[];
}

interface BookResponse {
    book: BookContent;
}

type CourseDetailNavigation = 'VIDEO' | 'BOOK' | 'ON_SEARCH' | 'CODE EDITOR';
interface UseSearchSubchapter {
    searchKeyword: string;
    searchResult?: SearchCourseResponse;
    isSearch: boolean;
    isSearchingLoading: boolean;
    isSearchingFetching: boolean;
    handleSearch: (params: {
        type?: 'BOOK' | 'CHAPTER' | 'SUBCHAPTER';
        page?: number;
    }) => void;
    setIsSearch: Dispatch<SetStateAction<boolean>>;
    setSearchKeyword: Dispatch<SetStateAction<string>>;
}

type SubchapterPathResponse = {
    course_slug: string;
    chapter_id: string;
    subchapter_id: string;
    subchapter_name: string;
    subchapter_slug: string;
    subchapter_thumbnail: string;
    video_is_free: boolean;
    video_duration: string;
};
