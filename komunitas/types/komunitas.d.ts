interface SubjectCategoriesResponse {
    categories: [
        {
            id: string;
            name: string;
        }
    ];
}

interface CommunityNotification {
    unseen_comment_counts: number;
}

interface PostQuestionAnswerPayload {
    post_id?: string | null;
    content: string;
    category_id: string;
    attachment_urls: string[];
}

interface PostQuestionAnswerResponse {
    id: string;
    parent_id?: string;
    content: string;
    comment_counts: number;
    viewer_counts: number;
    category: string;
    slug?: string;
    student: {
        id: string;
        username: string;
        photo_url?: string;
    };
    created_at: timestamp;
    student: [
        {
            id: string;
            url: string;
        }
    ];
}

interface CommunityPostQuery {
    category_id?: string;
    sort_by?: 'LATEST' | 'POPULAR' | 'ANSWERED' | 'NOT_ANSWERED';
    user_id?: string;
    search?: string;
}

interface CommunityPost {
    id: string;
    content: string;
    slug: string;
    category: string;
    viewer_counts: number;
    comment_counts: number;
    created_at: timestamp;
    student: {
        id: string;
        photo_url: string;
        username: string;
    };
}

interface CommunityPostResponse {
    community_posts: CommunityPost[];
}

interface MyQuestionListResponse {
    questions: {
        date: string;
        items: {
            id: string;
            content: string;
            slug: string;
            unseen_comment_counts: number;
            created_at: timestamp;
        }[];
    }[];
}

interface ExploreQuestionResponse {
    questions: [
        {
            id: string;
            slug: string;
            content: string;
        }
    ];
}

interface CommunityPostDetailResponse {
    id: string;
    content: string;
    viewer_counts: number;
    comment_counts: number;
    created_at: timestamp;
    category: string;
    student: {
        id: string;
        photo_url: string;
        username: string;
    };
}

interface CommunityPostCommentDetail {
    id: string;
    content: string;
    comment_counts: number;
    created_at: timestamp;
    student: {
        id: string;
        photo_url: string;
        username: string;
        is_expert: boolean;
    };
}

interface CommunityPostCommentDetailResponse {
    comments: CommunityPostCommentDetail[];
}
