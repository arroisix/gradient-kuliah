export interface User {
    name: string;
    photo_profile: string;
}

export interface Flashcard {
    id: string;
    title: string;
    description: string;
    is_private: boolean;
    card_count: number;
    created_by: User;
}

export interface FlashcardSource {
    type: string;
    file_name: string;
}

export interface FlashcardContent {
    type: string;
    content: Array<{
        type: string;
        attrs?: {
            textAlign?: string;
            alt?: string | null;
            src?: string;
            title?: string | null;
            width?: number;
            height?: string;
            'data-align'?: string;
        };
        content?: Array<{
            text?: string;
            type?: string;
        }>;
    }>;
}

export interface Card {
    id: string;
    question: FlashcardContent;
    answer: FlashcardContent;
    updated_at: string;
    is_favorite?: boolean;
}

export interface FlashcardDetail extends Flashcard {
    cards: Card[];
}

export interface FlashcardListResponse {
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
    data: Flashcard[];
}

export interface FlashcardCopilotResponse extends Flashcard {
    ai_generated: boolean;
    is_completed: boolean;
    sources: FlashcardSource[];
}

export interface CreateFlashcardRequest {
    title: string;
    description: string;
    is_private: boolean;
}

export interface CreateFlashcardCopilotRequest extends CreateFlashcardRequest {
    file_sources: string[];
}

export interface CardRequest {
    question: FlashcardContent;
    answer: FlashcardContent;
}

export interface LastSeenResponse {
    data: Flashcard[];
}
