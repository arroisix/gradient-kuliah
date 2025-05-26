interface LearningTool {
    name: 'Quiz' | 'Flashcard' | 'Cheatsheet' | 'Study Plan';
    is_coming_soon: boolean;
}

interface LearningToolsResponse {
    learning_tools: LearningTool[];
}

interface BaseContentItem {
    slug: string;
    title: string;
    created_by?: string;
    photo_profile?: string;
}

interface FlashcardItem extends BaseContentItem {
    type: 'Flashcard';
    card_count: number;
}

interface QuizItem extends BaseContentItem {
    type: 'Quiz';
    problem_count: number;
    icon: string;
    course: string;
    in_progress: boolean;
    progress_percentage: number;
}

type LearningToolsContentItem = FlashcardItem | QuizItem;

interface LearningToolsContentResponse {
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
    data: LearningToolsContentItem[];
}

interface Device {
    device_id: string;
    device_type: 'Phone' | 'Tablet';
}

interface DevicesResponse {
    data: Device[];
}

interface DownloadedVideo {
    id: string;
    thumbnail: string;
    course_name: string;
    duration: string;
    title: string;
    chapter_title: string;
    is_downloaded: boolean;
    video_slug: string;
    course_slug: string;
}

interface DownloadHistoryResponse {
    data: DownloadedVideo[];
    count_items: number;
    next_page: number;
    previous_page: number;
}

interface DownloadHistoryParams {
    device_id?: string;
    is_removed?: boolean;
    page?: number;
    limit?: number;
    keyword?: string;
}
