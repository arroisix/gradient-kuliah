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
}

interface ExerciseLandingPage {
    my_exercises: ExerciseItem[];
    exercises: ExerciseItem[];
    current_page: number;
    total_pages: number;
    total_items: number;
    limit: number;
}

export interface ExerciseHistory {
    exercise_id: string;
    history: Array<{
        attempt: number;
        score: number;
        date: string;
        score_change: number | null;
    }>;
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
        text: string;
        type: string;
        options: Array<any>;
        explanation: string;
    };
    current_problem_number: number;
    next_navigation: NavigationItem | null;
    prev_navigation: NavigationItem | null;
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
}

export interface ExerciseProblemProgress {
    id: string;
    exercise_progress_id: string;
    problem_id: string;
    status: string;
    submitted_answer_text: string | null;
    submitted_answer_id: string | null;
    is_correct: boolean | null;
    started_at: string;
    completed_at: string | null;
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
