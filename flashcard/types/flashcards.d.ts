export interface User {
    name: string;
    photo_profile: string;
}

export interface Flashcard {
    id: string;
    slug: string;
    title: string;
    description: string;
    is_private: boolean;
    card_count: number;
    created_by: User;
    created_by_me: boolean;
}

export interface FlashcardSource {
    type: string;
    file_name: string;
}

export interface Card {
    id: string;
    question: string;
    answer: string;
    updated_at: string;
    is_favorite?: boolean;
}

export interface FlashcardDetail extends Flashcard {
    ai_generated: boolean;
    is_completed: boolean;
    sources: FlashcardSource[];
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
    question: string;
    answer: string;
}

export interface LastSeenResponse {
    data: Flashcard[];
}
