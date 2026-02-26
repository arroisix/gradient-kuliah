interface QnaQuestionPostData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
    video_id: string;
}

interface QnaAnswerPostData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
    question_id: string;
}

type QnaAuthor = {
    email: string;
    full_name: string;
};

type QnaQuestion = {
    id: string;
    created_at: Date;
    author: QnaAuthor;
    video_id: string;
    content: string;
    attachment: string[];
    is_anonymous: boolean;
    answer_count: number;
};

type QnaAnswer = {
    id: string;
    created_at: Date;
    author: QnaAuthor;
    question_id: string;
    content: string;
    attachment: string[];
    is_anonymous: boolean;
};

type ExamWorksheet = {
    id: string;
    question_count: number;
    question_id_sequence: string[];
    test_duration: Date;
    treshold_score: number;
    exercise_name: string;
    is_new_worksheet: boolean;
    latest_exam_score?: number;
    exam_available: boolean;
};

type ExamAnswer = {
    id: string;
    answer: string;
    is_answer?: boolean | null;
};

type QuestionType = 'short_answer' | 'multiple_choice' | 'multiple_answer';

type ExamQuestion = {
    id: string;
    question_code: string;
    question: string;
    solution: string;
    type_name: QuestionType;
    answers: ExamAnswer[];
};

type ExamQuestionSequence = {
    id: string;
    is_answered: boolean;
    is_correct?: boolean;
};

interface ExamWorksheetInputData {
    exercise_id: string;
    learning_progress_id: string;
    packet_id: string;
}

interface ExamQuestionResponse {
    question: ExamQuestion;
    user_answer: {
        id: string;
        answer_text?: string;
        answers: ExamAnswer[];
        is_correct_answer?: boolean;
        question_id: string;
        question_solution?: string;
    };
}

interface ExamQuestionInputData {
    question_id: string;
    worksheet_id: string;
    exercise_id: string;
}

interface ExamAnswerInputData {
    worksheet_id: string;
    question_id: string;
    answers?: string[];
    answer_text?: string;
}

interface ExamAnswerResponse {
    id: string;
    answer_text?: string;
    answers?: string[];
    question_id: string;
}

interface ListQuestionSequenceResponse {
    questions: ExamQuestionSequence[];
    is_finished: boolean;
}

interface FinishExamResponse {
    is_finished: boolean;
    final_score: number;
    correct_answer: number;
    question_count: number;
    duration_taken: string;
    packet_id: string;
    worksheet_id: string;
    learning_progress_id: string;
}

type AiTutorMessage = {
    id: string;
    agent?: string;
    message: {
        message: string;
    };
    model_name?: string;
};

interface ChatRoomResponse {
    id: string;
    messages: AiTutorMessage[];
}

interface AskTutorInput {
    query: string;
    ai_unique_id: string;
}

interface TutorAnswerResponse {
    question: AiTutorMessage;
    answer: AiTutorMessage;
}

interface AITutorFeedbackResponse {
    feedback_status: string;
    feedback_content: string;
}

interface AITutorFeedbackInput {
    feedback_status: string;
    feedback_content: string;
    answer_id: string;
}

type IconOption = {
    tag: keyof JSX.IntrinsicElements;
    icon: JSX.Element;
    tracker: string;
    disableClick?: boolean;
    disabled?: boolean;
    props?: Record<string, any>;
};

interface QnaFormInputData {
    content: string;
    attachment?: string;
}

type CodingProgress = {
    id: string;
    latest_code: string;
};

interface GetCodingProgressInputData {
    watch_progress_id: string;
    code_editor_id: string;
}

interface TrackCodingProgressInputData {
    coding_progress_id: string;
    latest_code: string;
}

interface GetBookRecommendationRequest {
    category: 'astronotes' | 'bank-soal' | 'textbook' | string;
    slug: string;
    astronotes_only?: boolean;
}
interface GetBookRecommendationResponse {
    related_books: Astronote[];
    other_books: Astronote[];
}

type VideoRecommendation = {
    id: string;
    title: string;
    subchapter_slug: string;
    course_slug: string;
    course_name: string;
    thumbnail: string;
};
interface GetVideoRecommendationResponse {
    related_videos: VideoRecommendation[];
    other_videos: VideoRecommendation[];
}

type CourseRecommendation = Omit<
    VideoRecommendation,
    'subchapter_slug' | 'title'
>;

interface GetCourseRecommendationResponse {
    related_courses: CourseRecommendation[];
    other_courses: CourseRecommendation[];
}

interface Histogram {
    range: string;
    total_participants: number;
}

interface GetCompetitionMapResponse {
    total_participants: number;
    user_score?: number;
    user_bar_index?: number;
    passing_grade?: number;
    passing_grade_bar_index?: number;
    histogram: Histogram[];
}

interface GetSpiderChartResponse {
    id: string;
    title: string;
    average_score: number;
}
