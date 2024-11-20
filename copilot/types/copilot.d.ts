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
    History: {
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
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface MainSectionProps {
    onSendMessage: (prompt: string) => Promise<void>;
}
