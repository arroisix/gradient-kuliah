import { baseApi } from 'redux/api/baseApi';
import {
    Exercise,
    ExerciseHistory,
    ExerciseLandingPage,
    ExerciseProblem,
    ExerciseProblemProgress, ExerciseProblemProgressList,
    ExerciseProgress,
    ExerciseReportSummary
} from '../../types/exercises';

const EXERCISE_BASE_URL = 'exercises/';

export const exerciseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getExerciseDetail: builder.query<Exercise, { exercise_slug: string }>({
            query: ({ exercise_slug }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/`
            }),
            providesTags: (result, error, arg) => [
                { type: 'ASTRONOTES', id: `EXERCISE_${arg.exercise_slug}` }
            ]
        }),

        getExerciseHistory: builder.query<
            ExerciseHistory,
            { exercise_slug: string }
        >({
            query: ({ exercise_slug }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/history/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_HISTORY_${arg.exercise_slug}`
                }
            ]
        }),

        getExerciseProblem: builder.query<
            ExerciseProblem,
            { exercise_slug: string; problem_id: string }
        >({
            query: ({ exercise_slug, problem_id }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/problems/${problem_id}/`
            }),
            providesTags: (result, error, arg) => [
                { type: 'ASTRONOTES', id: `EXERCISE_PROBLEM_${arg.problem_id}` }
            ]
        }),

        getExerciseProgress: builder.query<
            ExerciseProgress,
            { exercise_slug: string }
        >({
            query: ({ exercise_slug }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROGRESS_${arg.exercise_slug}`
                }
            ]
        }),

        createExerciseProgress: builder.mutation<
            ExerciseProgress,
            { exercise_slug: string }
        >({
            query: ({ exercise_slug }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'ASTRONOTES', id: `EXERCISE_${arg.exercise_slug}` },
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROGRESS_${arg.exercise_slug}`
                }
            ]
        }),

        updateExerciseProgress: builder.mutation<
            ExerciseProgress,
            {
                exercise_slug: string;
                progress_id: string;
                data: Partial<ExerciseProgress>;
            }
        >({
            query: ({ exercise_slug, progress_id, data }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/${progress_id}/`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'ASTRONOTES', id: `EXERCISE_${arg.exercise_slug}` }
            ]
        }),

        getLatestExerciseProblemProgress: builder.query<
            ExerciseProblemProgress,
            {
                problem_progress_id: string;
            }
        >({
            query: ({ problem_progress_id }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/problem-progress/${problem_progress_id}/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROBLEM_PROGRESS_${arg.problem_progress_id}`
                }
            ]
        }),

        createExerciseProblemProgress: builder.mutation<
            ExerciseProblemProgress,
            {
                exercise_slug: string;
                exercise_progress_id: string;
                problem_id: string;
            }
        >({
            query: ({ exercise_slug, exercise_progress_id, problem_id }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'ASTRONOTES', id: `EXERCISE_PROBLEM_${arg.problem_id}` }
            ]
        }),

        updateExerciseProblemProgress: builder.mutation<
            ExerciseProblemProgress,
            {
                exercise_slug: string;
                exercise_progress_id: string;
                problem_id: string;
                problem_progress_id: string;
                data: Partial<ExerciseProblemProgress>;
            }
        >({
            query: ({
                exercise_slug,
                exercise_progress_id,
                problem_id,
                problem_progress_id,
                data
            }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/${problem_progress_id}/`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'ASTRONOTES', id: `EXERCISE_PROBLEM_${arg.problem_id}` }
            ]
        }),

        getExerciseProblemProgressList: builder.query<
            ExerciseProblemProgressList,
            {
                exercise_slug: string;
                exercise_progress_id: string;
                problem_id: string;
            }
        >({
            query: ({ exercise_slug, exercise_progress_id, problem_id }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROBLEM_PROGRESS_LIST_${arg.exercise_progress_id}`
                }
            ]
        }),

        getExerciseReportSummary: builder.query<
            ExerciseReportSummary,
            { exercise_slug: string }
        >({
            query: ({ exercise_slug }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/summary/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_SUMMARY_${arg.exercise_slug}`
                }
            ]
        }),

        getExerciseProblemReport: builder.query<
            any,
            { exercise_slug: string; problem_id: string }
        >({
            query: ({ exercise_slug, problem_id }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/problems/${problem_id}/report/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROBLEM_REPORT_${arg.problem_id}`
                }
            ]
        }),

        getExerciseLandingPage: builder.query<
            ExerciseLandingPage,
            {
                page?: number;
                limit?: number;
                status?: string;
                subject?: string;
                sort?: string;
            }
        >({
            query: (params) => ({
                url: `${EXERCISE_BASE_URL}exercises/`,
                params
            }),
            providesTags: () => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_ENTRYPOINT`
                }
            ]
        })
    })
});

export const {
    useGetExerciseDetailQuery,
    useGetExerciseHistoryQuery,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
    useGetLatestExerciseProblemProgressQuery,
    useGetExerciseProblemProgressListQuery,
    useCreateExerciseProgressMutation,
    useUpdateExerciseProgressMutation,
    useCreateExerciseProblemProgressMutation,
    useUpdateExerciseProblemProgressMutation,
    useGetExerciseReportSummaryQuery,
    useGetExerciseProblemReportQuery,
    useGetExerciseLandingPageQuery
} = exerciseApi;

export const {
    getExerciseDetail,
    getExerciseHistory,
    getExerciseProblem,
    getExerciseReportSummary,
    getExerciseProblemReport,
    getLatestExerciseProblemProgress,
    getExerciseLandingPage
} = exerciseApi.endpoints;
