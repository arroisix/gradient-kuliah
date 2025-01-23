interface LearningTool {
    name: string;
    is_coming_soon: boolean;
}

interface LearningToolsResponse {
    learning_tools: LearningTool[];
}

interface LearningToolsContentItem {
    type: 'Quiz' | 'Flashcard';
    slug: string;
    title: string;
    card_count?: number;
    problem_count?: number;
    created_by?: string;
    photo_profile?: string;
    icon?: string;
    course?: string;
    in_progress?: boolean;
    progress_percentage?: number;
}

interface LearningToolsContentResponse {
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
    data: LearningToolsContentItem[];
}
