export interface ChatResponse {
    type: 'CONTENT' | 'INFO';
    content: string | null;
    message_id: string | null;
    session_id: string | null;
    session_name: string | null;
    keyword: string | null;
}

export interface ContextReference {
    id: string;
    title: string;
    subtitle: string;
    header: string;
}

export interface ChatInput {
    input_text: string;
    session_id?: string;
    image_url?: string;
    context?: {
        textbook_problem: ContextReference[];
        book_pages: ContextReference[];
        video: ContextReference[];
        bank_soal_problem: ContextReference[];
    };
    book_slug?: string;
    chapter_id?: string;
}

export interface ChatHistoryContextItem {
    id: string;
    title: string;
    subtitle: string;
    header: string;
    content_type:
        | 'astronotes_content'
        | 'textbook_problem'
        | 'bank_soal_problem'
        | 'course_video';
}

export type ContentRecommendationType =
    | 'course'
    | 'chapter'
    | 'video'
    | 'exercise'
    | 'article'
    | 'tryout';

export interface CopilotContentRecommendation {
    id: string;
    slug: string;
    title: string;
    type: ContentRecommendationType;
}

export interface PerformanceAnalysis {
    tryout_title: string;
    total_score: number;
    passing_grade: number;
    target_institution: string;
    target_major: string;
    problemset_results: {
        problemset_title: string;
        score: number;
        chapter_need_to_improve: string[];
        chapter_mastered: string[];
    }[];
}

export interface ExerciseQuestion {
    id: string;
    no: number;
    question: string;
    options: { id: string; value: string }[];
    answer: string;
    explanation: string;
}

export interface ChatHistoryResponse {
    session_id: string;
    history: {
        role: 'AI' | 'User';
        message: string;
        image?: string | null;
        message_id: string;
        rating: number;
        is_bookmarked: boolean;
        keyword?: string | null;
        context?: { data: ChatHistoryContextItem[] };
        rich_content?: {
            content_recommendations?: ContentRecommendation[];
            performance_analysis?: PerformanceAnalysis;
            exercise_questions?: ExerciseQuestion[];
        };
    }[];
}

export interface ChangeRatingInput {
    session_id: string;
    message_id: string;
    rating: number;
}

export interface ChatMessage {
    id: string;
    role: 'AI' | 'User';
    content: string;
    timestamp: string;
    rating?: number;
    isBookmarked?: boolean;
    image?: string | null;
    keyword?: string | null;
    usedReferences?: SelectedReference[];
    rich_content?: {
        content_recommendations?: ContentRecommendation[];
        performance_analysis?: PerformanceAnalysis;
        exercise_questions?: ExerciseQuestion[];
    };
}

interface BookmarkedChatsResponse {
    data: Array<{
        message_id: string;
        session_id: string;
        role: 'AI' | 'User';
        message: string;
        timestamp: string | null;
    }>;
}

interface SessionHistoryResponse {
    data: Array<{
        id: string;
        name: string;
        latest_chat: string;
        latest_chat_at: string | null;
    }>;
}

interface RenameSessionInput {
    session_id: string;
    name: string;
}

interface ToggleBookmarkInput {
    session_id: string;
    message_id: string;
}

interface ContentRecommendation {
    type:
        | 'course_video'
        | 'astronotes_content'
        | 'textbook_problem'
        | 'bank_soal_problem';
    course_slug: string | null;
    subchapter_name: string | null;
    subchapter_slug: string | null;
    thumbnail: string | null;
    book_name: string | null;
    book_slug: string | null;
    book_page: number | null;
    problem_slug: string | null;
    snippet: string | null;
}

interface ContextRecommendation {
    id: string;
    type:
        | 'course'
        | 'astronotes_content'
        | 'textbook_problem'
        | 'bank_soal_problem';
    thumbnail: string | null;

    snippet: string | null;
    book_name: string | null;
    book_slug: string | null;

    course_slug: string | null;
    course_name: string | null;

    book_page: number | null;
    page_content: string | null;

    problem_slug: string | null;
    problem_solution: string | null;
    problem_question: string | null;
    problem_title: string | null;
}

interface ContentRecommendationResponse {
    recommendation: ContentRecommendation[];
}

interface ContextRecommendationResponse {
    recommendation: ContextRecommendation[];
    count_items?: number;
    next_page?: number | null;
    previous_page?: number | null;
}

export interface MainSectionProps {
    onSendMessage: (prompt: string, imageUrl?: string) => void;
    onImageCapture: () => void;
}

export interface TextbookChapter {
    id: string;
    title: string;
}

export interface TextbookSection {
    id: string;
    title: string;
}

export interface TextbookProblem {
    id: string;
    slug: string;
    title: string;
}

export interface TextbookChaptersResponse {
    data: TextbookChapter[];
}

export interface TextbookSectionsResponse {
    data: TextbookSection[];
}

export interface TextbookProblemsResponse {
    data: TextbookProblem[];
}

export interface CourseChapter {
    id: string;
    title: string;
}

export interface CourseSubchapter {
    slug: string;
    name: string;
    video_id: string;
}

export interface CourseChaptersResponse {
    data: CourseChapter[];
}

export interface CourseSubchaptersResponse {
    data: CourseSubchapter[];
}

export interface AstronotesChapter {
    id: string;
    value: string;
    page_id: string;
    page_order: number;
}

export interface AstronotesSubchapter {
    id: string;
    value: string;
    page_id: string;
    page_order: number;
}

export interface AstronotesTopic {
    id: string;
    value: string;
    page_id: string;
    page_order: number;
}

export interface AstronotesChaptersResponse {
    data: AstronotesChapter[];
}

export interface AstronotesSubchaptersResponse {
    data: AstronotesSubchapter[];
}

export interface AstronotesTopicsResponse {
    data: AstronotesTopic[];
}

export interface BankSoalChapter {
    id: string;
    title: string;
}

export interface BankSoalSection {
    id: string;
    title: string;
}

export interface BankSoalProblem {
    id: string;
    slug: string;
    title: string;
}

export interface BankSoalChaptersResponse {
    data: BankSoalChapter[];
}

export interface BankSoalSectionsResponse {
    data: BankSoalSection[];
}

export interface BankSoalProblemsResponse {
    data: BankSoalProblem[];
}

export type ReferenceContentType =
    | 'textbook_problem'
    | 'course'
    | 'astronotes_content'
    | 'bank_soal_problem';

interface SelectedReference {
    id: string;
    title: string;
    subtitle?: string;
    header: string;
    contentType: ReferenceContentType;
}

export interface ContentSearchItem {
    id: string;
    title: string;
    subtitle: string | null;
    header: string;
    section_name?: string | null;
    problem_question?: string | null;
    problem_solution?: string | null;
}

export interface ContentSearchResponse {
    data: ContentSearchItem[];
}

export interface Reasoning {
    thoughts: string[];
    isFinished: boolean;
}

export interface GetContentRecommendation {
    data: {
        type: ContentRecommendationType;
        id: string;
        slug: string;
        progress?: number;
        is_free?: boolean;
        title: string;
        tags?: string;
        chapter_slug: string;
        subchapter_slug: string;
        subchapter_name: string;
        thumbnail?: string;
        cover?: string;
        total_question_count?: number;
        total_duration?: number;
        start_at?: string;
        closes_at?: string;
        video_duration?: string;
    }[];
}
