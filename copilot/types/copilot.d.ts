export interface ChatResponse {
    type: 'CONTENT' | 'INFO';
    content: string | null;
    message_id: string | null;
    session_id: string | null;
}

export interface ChatInput {
    input_text: string;
    session_id?: string;
    image_url?: string;
}

export interface ChatHistoryResponse {
    history: {
        role: 'AI' | 'User';
        message: string;
        image?: string | null;
        message_id: string;
        rating: number;
        is_bookmarked: boolean;
    }[];
}

export interface ChangeRatingInput {
    session_id: string;
    message_id: string;
    rating: number;
}

export interface ToggleBookmarkInput {
    session_id: string;
    message_id: string;
}

export interface ChatMessage {
    id: string;
    role: 'AI' | 'User';
    content: string;
    timestamp: string;
    rating?: number;
    isBookmarked?: boolean;
    image?: string | null;
}

export interface MainSectionProps {
    onSendMessage: (prompt: string, imageUrl?: string) => void;
}
