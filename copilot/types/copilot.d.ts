export interface ChatResponse {
    type: 'CONTENT' | 'INFO';
    content: string | null;
    message_id: string | null;
    session_id: string | null;
    session_name: string | null;
    keyword: string | null;
}

export interface ChatInput {
    input_text: string;
    session_id?: string;
    image_url?: string;
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

export interface MainSectionProps {
    onSendMessage: (prompt: string, imageUrl?: string) => void;
}
