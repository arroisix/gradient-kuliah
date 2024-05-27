interface GetAstronotesContentResponse {
    page_id: string;
    is_bookmarked: boolean;
    is_tiptap: boolean;
    slug: string;
    chapter_title: string;
    total_page: number;
    current_page: number;
    page_content: string;
}

type BookChapter = {
    id: string;
    title: string;
    notebook_url: string;
    notion_id: string;
    subsection: { sections: { key: string; title: string }[] };
    order: number;
    page_order: number;
};

type BookSubchapterSection = {
    id: string;
    title: string;
    order: number;
    page_order: number;
};

type BookSubchapter = {
    sections: BookSubchapterSection[];
} & BookChapter;

type AstronotesMenuItem = {
    icon: JSX.Element;
    label: string;
    value: NavigationTypes;
    eventNames?: Record<string, string>;
};

interface GetBookChapterResponse {
    data: BookChapter[];
}

interface HighlightsInterface {
    book_chapter_id: string;
    title: string;
    order: number;
    blocks: {
        block_heading: string | null;
        highlights: {
            text: string;
            page_order: number;
            color: string;
        }[];
    }[];
}

interface getHighlightReponse {
    data: HighlightsInterface[];
}

interface postHighlightBody {
    block_content_id: string;
    text: string;
    anchor_offset: number;
    focus_offset: number;
    color: string;
    slug: string;
}

type Bookmark = {
    page_chapters: string[];
    page_order: number;
};

interface DataHighlightedInterface {
    block_content_id: string;
    text: string;
    anchor_offset: number;
    focus_offset: number;
}

type AstronotesFontStyle = 'DEFAULT' | 'SERIF' | 'MONO';
type NavigationTypes =
    | 'CLOSE'
    | 'LIST_CONTENT'
    | 'BOOKMARK'
    | 'SETTING'
    | 'RATING'
    | 'FEEDBACK';

interface AstronotesState {
    navigation: NavigationTypes;
    fontStyle: AstronotesFontStyle;
    smallText: boolean;
    isModalRatingOpen: boolean;
    isModalFeedbackOpen: boolean;
    // TODO(angga): removed until higher in priority
    // highlighted: boolean;
    // removeHighlighted: boolean;
    // highlightId: string;
    // dataHighlighted: DataHighlightedInterface | null;
    // points: { x: number; y: number; width: number };
}

interface Astronote {
    id: string;
    slug: string;
    title: string;
    rating: number;
    book_cover_url: string;
    authors?: string[];
    education_level?: string;
    isbn?: string;
    category_id: string;
    category_name: string;
    category?: string;
    in_progress?: boolean;
    is_free: boolean;
    is_public: boolean;
    is_tiptap?: boolean;
    percentage_progress?: number;
    last_chapter_read?: string;
    latest_page?: string;
}
interface AstronoteBooksResponse {
    books: Astronote[];
}
interface AstronotesBooksQueryParams extends BaseListQueryParams {
    major?: string;
    type?: string;
    status?: string;
}

interface BookDetailInterface {
    title: string;
    cover_url: string;
    category: string;
    rating: number;
    feedback_total: number;
    authors: string[];
    isbn: string;
    keywords: string;
    description: string;
    chapters: {
        id: string;
        title: string;
    }[];
    is_free: boolean;
    is_public: boolean;
    first_problem_id?: string;
}

interface GetBookDetailResponse {
    book: BookDetailInterface;
}

interface TextbookSolution {
    problem: TextbookProblem;
    next_problem_id: string;
    prev_problem_id: string;
}

interface TextbookProblem {
    id: string;
    title: string;
    chapter_id: string;
    chapter: string;
    section_id?: string;
    section?: string;
    page_number: number;
    is_published: boolean;
    review: {
        rating: number;
        comment: string;
    } | null;
    question: {
        type: 'multiple_choice' | 'open_ended';
        badge: 'verified' | 'generated';
        answers: [
            {
                id: string;
                answer: string;
                is_answer: boolean;
                is_case_sensitive: boolean;
            }
        ];
        solution: string;
        multiple_steps_solution: boolean;
    };
}

interface GetLandingPopularBooksQueryParam {
    major?: string;
}

interface GetLandingPopularBooksResponseData {
    books: LandingPopularBook[];
}

type LandingPopularBook = {
    id: string;
    title: string;
    slug: string;
    book_cover_url: string;
    category_name: 'Textbook' | 'Astronotes' | 'Bank Soal';
};