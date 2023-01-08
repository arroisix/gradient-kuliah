interface QnaQuestionPostData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
    video_id: string;
}

interface QnaAnswerPostData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
    question_id: string;
}

type QnaAuthor = {
    email: string;
    full_name: string;
};

type QnaQuestion = {
    id: string;
    created_at: Date;
    author: QnaAuthor;
    video_id: string;
    content: string;
    attachment: string[];
    is_anonymous: boolean;
    answer_count: number;
};

type QnaAnswer = {
    id: string;
    created_at: Date;
    author: QnaAuthor;
    question_id: string;
    content: string;
    attachment: string[];
    is_anonymous: boolean;
};
