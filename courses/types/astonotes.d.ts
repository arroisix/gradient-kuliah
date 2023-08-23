interface getBookProgressResponse {
    page_id: string;
    is_bookmarked: boolean;
    slug: string;
    chapter_title: string;
    total_page: number;
    current_page: number;
    blocks: {
        id: string;
        order: number;
        contents: [
            {
                id: string;
                text: string;
                type: string;
                annotation: {
                    anchor_offset: string;
                    focus_offset: string;
                    color: string;
                };
            }
        ];
    }[];
}

interface getTableContentsResponse {
    contents: [
        {
            book_chapter_id: string;
            title: string;
            order: number;
            page_id: string;
            blocks: {
                block_id: string;
                block_heading: string;
                page_id: string;
            }[];
        }
    ];
}

interface getHighlightReponse {
    data: {
        book_chapter_id: string;
        title: string;
        order: number;
        blocks: {
            block_id: string;
            block_heading: string | null;
            highlights: {
                text: string;
                page_id: string;
            }[];
        }[];
    }[];
}

interface postHighlightBody {
    page_id: string;
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
