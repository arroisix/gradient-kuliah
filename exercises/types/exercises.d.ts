export interface Exercise {
    id: string;
    slug: string;
    title: string;
    course: {
        id: string;
        name: string;
        slug: string;
    };
    icon: string;
    total_problems: number;
    total_duration: number;
    is_free: boolean;
    problem_sets: Array<{
        id: string;
        name: string;
        order: number;
        show_solution: string;
        time_constraint: string;
        time_limit: number;
        problem_count: number;
        first_problem_id: string;
    }>;
    is_already_completed: boolean;
    latest_progress: ExerciseProgress & {
        next_problem_id: string;
        next_problem_title: string;
        next_section_id: string;
        next_section_title: string;
    };
}

export interface ExerciseDetail {
    id: string;
    slug: string;
    title: string;
    course: {
        id: string;
        name: string;
        slug: string;
    };
    total_problems: number;
    total_duration: number;
    type?: string;
    exercise_code?: string;
    tryout_type?: string;
    university_name?: string;
    university_color?: string;
    is_free: boolean;
    // TODO make it better type
    first_problemset: {
        id: string;
        name: string;
        order: number;
        show_solution: string | null;
        time_constraint: string | null;
        time_limit: number | null;
        problem_count: number;
        first_problem_id: string;
    };
    is_completed: boolean;
    // TODO make it better type
    latest_problemset_progress: {
        problemset_id: string;
        name: string;
        order: number;
        last_problem_id: string;
        last_problem_title?: string;
    };
    latest_exercise_progress: {
        id: string;
        status: string;
        completed_at: string | null;
        score: number;
        correct_answers: number;
        incorrect_answers: number;
        submitted_answers: number;
        total_questions: number;
    };
}

interface ExerciseItem {
    id: string;
    slug: string;
    title: string;
    subject: string;
    icon: string;
    total_questions: number;
    progress?: number;
    status?: string;
    is_free: boolean;
    duration?: number;
    score?: number;
    progress_percentage?: number;
    type?: string;
    exercise_code?: string;
    tryout_type?: string;
    university_name?: string;
    university_color?: string;
}

interface CourseFilter {
    id: string;
    name: string;
}

interface ExerciseLandingPage {
    my_exercises: ExerciseItem[];
    exercises: ExerciseItem[];
    count_items: number;
    next_page: number | null;
    previous_page: number | null;
    current_page: number;
    limit: number;
    course_filters: CourseFilter[];
}

interface ExerciseLandingPageV2 extends ListResponseData<ExerciseItem> {
    current_page: number;
    limit: number;
}

export interface ExerciseHistory {
    exercise_id: string;
    history: Array<ExerciseHistoryItem>;
}

export interface ExerciseHistoryItem {
    id: string;
    attempt: number;
    score: number;
    date: string;
    score_change: number | null;
}

export interface NavigationItem {
    id: string;
    type: 'problem' | 'section';
}

export interface ExerciseProblem {
    id: string;
    problem_set_id: string;
    title: string;
    is_free: boolean;
    question: {
        id: string;
        question: any;
        type: string;
        options: Array<{
            id: string;
            answer: any;
            is_correct: boolean;
        }>;
        solution: any;
    };
    current_problem_number: number;
    next_navigation: NavigationItem | null;
    prev_navigation: NavigationItem | null;
    single_answer: boolean;
}

export interface ExerciseProblemSolution {
    id: string;
    question_id: string;
    solution: any;
    options: Array<{
        id: string;
        answer: any;
        is_correct: boolean;
    }>;
}

export interface ExerciseProgress {
    id: string;
    student_id: string;
    exercise_id: string;
    status: string;
    last_problem_id: string | null;
    started_at: string;
    completed_at: string | null;
    score: number;
    created_at: string;
    answered_questions: number;
    total_questions: number;
}

export interface ExerciseProblemProgress {
    id: string;
    exercise_progress_id: string;
    problem_id: string;
    status: string;
    submitted_answer_text: string | null;
    submitted_answer_ids: string[];
    is_correct: boolean | null;
    started_at: string;
    completed_at: string | null;
    all_problems_answered: boolean;
}

export interface ExerciseProblemProgressList {
    problem_progresses: ExerciseProblemProgress[];
}

export interface ExerciseReportSummary {
    exercise_id: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    percentile: number;
    mastered_topics: string[];
    topics_to_improve: string[];
    performance_breakdown: Array<{
        topic: string;
        avg_time: number;
        correct: number;
        total: number;
        related_subchapters: string[];
        recommendation: Array<{
            id: string;
            name: string;
            type: string;
        }>;
    }>;
}

export interface ExerciseInProblemSet {
    id: string;
    order: number;
    is_answered: boolean;
}

export interface ProblemSetDetail {
    id: string;
    name: string;
    order: number;
    show_solution: string;
    time_constraint: string;
    time_limit: number;
    problems: ExerciseInProblemSet[];
    total_problems: number;
    answered_problems: number;
    unanswered_problems: number;
}

export interface ExerciseProblemReport {
    problems: ProblemReport[];
    current_page: number;
    limit: number;
    total_items: number;
    all_problems_answered: boolean;
}

export interface ProblemReport {
    id: string;
    question: {
        text: any;
        type: string;
        options: Array<{
            id: string;
            text: any;
            is_correct: boolean;
        }>;
    };
    solution: any;
    solution_id: string;
    user_progress: {
        status: string;
        submitted_answer: string[];
        is_correct: boolean | null;
        started_at: string;
        completed_at: string | null;
    };
    performance: {
        percentile: number;
        message: string;
    };
    topics_to_review: {
        chapter: string;
        subchapters: string[];
    };
    recommended_materials: Array<{
        id: string;
        name: string;
        slug: string;
        type: 'Course' | 'Video' | 'Book';
        thumbnail: string;
        book_type?: 'astronotes' | 'bank-soal' | 'text-book';
        rating?: number;
    }>;
    attempt_history: Array<{
        attempt: number;
        score: number;
        date: string;
        submitted_answer: string[];
    }>;
}

interface RecommendedMaterial {
    id: string;
    name: string;
    slug: string;
    type: 'Course' | 'Video' | 'Book';
    thumbnail: string;
    book_type?: 'astronotes' | 'bank-soal' | 'text-book';
    rating?: number;
    course_slug?: string;
    subchapter_slug?: string;
    is_free?: boolean;
}

export interface AstronotesExercise {
    id: string;
    slug: string;
    title: string;
    subject: string;
    icon: string;
    total_questions: number;
    progress?: number;
    status?: string;
    is_free: boolean;
}

interface Option {
    id: string;
    answer: any;
}

export interface ProblemInProblemSet {
    id: string;
    problemset_id: string;
    problemset_name: string;
    problemset_order: number;
    show_solution: string | null;
    time_constraint: string | null;
    time_limit: number | null;
    started_at: string;
    should_completed_at: string;
    next_problemset_id: string | null;
    next_problem_id: string | null;
    previous_problem_id: string | null;
    problem_progress: {
        id: string;
        problem_id: string;
        submitted_answer_text: string | null;
        submitted_answer_ids: string[];
        status: string;
        is_correct: boolean | null;
        started_at: string;
        completed_at: string | null;
        should_completed_at: string | null;
    } | null;
    problem: {
        id: string;
        title: string;
        order: number;
        type: string;
        question: any;
        options: Option[];
    };
}

export interface ProblemNavigationItem {
    id: string;
    order: number;
    is_answered: boolean;
    is_correct: boolean | null;
}

export interface ProblemNavigationVerboseItem
    extends Omit<ProblemNavigationItem, 'id'> {
    problem_id: string;
    problem_progress_id: string;
    problemset_id: string;
    problemset_progress_id: string;
}

export interface SubmitUserAnswerResponse {
    is_show_solution: boolean;
}

export interface SubmitUserAnswerData {
    selected_answer_ids?: string[];
    submitted_answer_text?: string;
    problemset_progress_id: string;
    problem_progress_id: string;
    problem_id: string;
    slug: string;
}

export interface ProblemSetItem {
    id: string;
    first_problem_id: string;
    title: string;
    order: number;
    is_current: boolean;
}

export interface ProblemSolutionData {
    solution: any;
    user_answer_ids: string[];
    user_answer_text: string;
    correct_answer_ids: string[];
    correct_answer_text: string[];
}

export interface ExerciseLeaderboard {
    student: {
        id: string;
        username: string;
    };
    university_name: string;
    score: number;
    rank: number;
    is_current_user: boolean;
}
