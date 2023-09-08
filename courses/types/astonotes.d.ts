interface getBookProgressResponse {
    page_id: string;
    is_bookmarked: boolean;
    slug: string;
    chapter_title: string;
    total_page: number;
    current_page: number;
    page_content: string;
}

interface tableContentInterface {
    book_chapter_id: string;
    title: string;
    order: number;
    page_id: string;
    blocks: {
        block_id: string;
        block_heading: string;
        page_order: number;
    }[];
}

interface getTableContentsResponse {
    contents: tableContentInterface[];
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

interface getBookmarksReponse {
    bookmarks: {
        book_chapter_id: string;
        title: string;
        order: number;
        page_id: string;
        block_headings: string[];
    }[];
}
