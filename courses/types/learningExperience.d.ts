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

type ExamWorksheet = {
    id: string;
    question_count: number;
    question_id_sequence: string[];
    test_duration: Date;
    treshold_score: number;
    exercise_name: string;
    is_new_worksheet: boolean;
    latest_exam_score?: number;
    exam_available: boolean;
};

type ExamAnswer = {
    id: string;
    answer: string;
    is_answer?: boolean | null;
};

type QuestionType = 'short_answer' | 'multiple_choice' | 'multiple_answer';

type ExamQuestion = {
    id: string;
    question_code: string;
    question: string;
    solution: string;
    type_name: QuestionType;
    answers: ExamAnswer[];
};

type ExamQuestionSequence = {
    id: string;
    is_answered: boolean;
    is_correct?: boolean;
};

interface ExamWorksheetInputData {
    exercise_id: string;
    learning_progress_id: string;
    packet_id: string;
}

interface ExamQuestionResponse {
    question: ExamQuestion;
    user_answer: {
        id: string;
        answer_text?: string;
        answers: ExamAnswer[];
        is_correct_answer?: boolean;
        question_id: string;
        question_solution?: string;
    };
}

interface ExamQuestionInputData {
    question_id: string;
    worksheet_id: string;
    exercise_id: string;
}

interface ExamAnswerInputData {
    worksheet_id: string;
    question_id: string;
    answers?: string[];
    answer_text?: string;
}

interface ExamAnswerResponse {
    id: string;
    answer_text?: string;
    answers?: string[];
    question_id: string;
}

interface ListQuestionSequenceResponse {
    questions: ExamQuestionSequence[];
    is_finished: boolean;
}

interface FinishExamResponse {
    is_finished: boolean;
    final_score: number;
    correct_answer: number;
    question_count: number;
    duration_taken: string;
    packet_id: string;
    worksheet_id: string;
    learning_progress_id: string;
}
