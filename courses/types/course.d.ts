type ProgressType = 'VIDEO' | 'NOTEBOOK' | 'EXERCISE';

interface FilterCourseQueryParams {
    page?: int;
    limit?: int;
    is_subscribed?: boolean;
    keyword?: string;
}

interface TrackSubchapterProgressInputData {
    subchapter_id: string;
    learning_progress_id: string;
    progress_type: ProgressType;
    video_progress?: {
        video_id: string;
        last_duration: string;
        is_finished: boolean;
    };
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
    thumbnail: string;
    lecturers: Lecturer[];
    learning_progress?: LearningProgress;
};

type Lecturer = {
    name: string;
    photo: string;
    role: string;
};

type Chapter = {
    id: string;
    chapter_name: string;
    order: int;
    subchapters: SubChapter[];
};

type SubChapter = {
    id: string;
    order: int;
    type_name: 'lecture' | 'exercise';
    subchapter_name: string;
    notebook?: Notebook;
    video?: Video;
    thumbnail?: string;
};

type Notebook = {
    id: string;
    is_free: boolean;
    title: string;
    content: string;
    authors: Lecturer[];
    created_at: string | Date;
    references: string;
    thumbnail: string;
};

type Video = {
    id: string;
    video_url: string;
    is_free: boolean;
    duration: string;
    thumbnail: string;
    description: string;
    lecturers?: Lecturer[];
    subchapter_id?: string;
    progress?: VideoProgress;
    popup_questions?: PopupQuestion[];
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
    question: string;
    solution?: string;
    answers: ExerciseAnswer[];
};

type VideoProgress = {
    id: string;
    video: Video;
    last_duration: string;
    is_finished: boolean;
};

type SubchapterProgress = {
    id: string;
    latest_progress: ProgressType;
    video: VideoProgress;
    subchapter: SubChapter;
};

type LearningProgress = {
    id: string;
    latest_subchapter: SubchapterProgress;
};

type Packet = {
    id: string;
    is_free: string;
    packet_name: string;
    active_duration: number;
    is_lifetime: boolean;
    price: string;
    courses: Course[];
};
