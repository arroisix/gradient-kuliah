import { baseApi } from 'redux/api/baseApi';
import {
    Exercise,
    ExerciseHistory,
    ExerciseLandingPage,
    ExerciseProblem,
    ExerciseProblemProgress,
    ExerciseProblemReport,
    ExerciseProblemSolution,
    ExerciseProgress,
    ExerciseReportSummary,
    ProblemSetDetail
} from '../../types/exercises';

const EXERCISE_BASE_URL = 'exercises/';

export const exerciseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getExerciseDetail: builder.query<
            Exercise,
            { exercise_slug: string; token?: string }
        >({
            query: ({ exercise_slug, token }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/`,
                headers: token ? { Authorization: `Token ${token}` } : undefined
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

        getExerciseProblemSolution: builder.query<
            ExerciseProblemSolution,
            { exercise_slug: string; problem_id: string }
        >({
            query: ({ exercise_slug, problem_id }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/problems/${problem_id}/solution/`
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
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROBLEM_${arg.problem_id}`
                },
                { type: 'PROBLEM_SET', id: 'LIST' }
            ]
        }),

        getOrCreateExerciseProblemProgress: builder.query<
            ExerciseProblemProgress,
            {
                exercise_slug: string;
                exercise_progress_id: string;
                problem_id: string;
            }
        >({
            query: ({ exercise_slug, exercise_progress_id, problem_id }) => ({
                url: `${EXERCISE_BASE_URL}private/exercises/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROBLEM_PROGRESS_${arg.problem_id}`
                }
            ]
        }),

        getExerciseReportSummary: builder.query<
            ExerciseReportSummary,
            { exercise_slug: string; exercise_progress_id: string }
        >({
            query: ({ exercise_slug, exercise_progress_id }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/progress/${exercise_progress_id}/summary/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_SUMMARY_${arg.exercise_slug}_${arg.exercise_progress_id}`
                }
            ]
        }),

        getExerciseReport: builder.query<
            ExerciseProblemReport,
            { exercise_slug: string; exercise_progress_id: string }
        >({
            query: ({ exercise_slug, exercise_progress_id }) => ({
                url: `${EXERCISE_BASE_URL}exercises/${exercise_slug}/progress/${exercise_progress_id}/report/`
            }),
            providesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_REPORT_${arg.exercise_slug}_${arg.exercise_progress_id}`
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
                course_id?: string;
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
        }),

        getProblemSetDetail: builder.query<ProblemSetDetail, string>({
            query: (problemSetId) => ({
                url: `${EXERCISE_BASE_URL}exercises/problem-sets/${problemSetId}/`
            }),
            providesTags: [{ type: 'PROBLEM_SET', id: `LIST` }]
        })
    })
});

export const {
    useGetExerciseDetailQuery,
    useGetExerciseHistoryQuery,
    useGetExerciseProblemQuery,
    useGetExerciseProgressQuery,
    useGetLatestExerciseProblemProgressQuery,
    useGetOrCreateExerciseProblemProgressQuery,
    useCreateExerciseProgressMutation,
    useUpdateExerciseProgressMutation,
    useCreateExerciseProblemProgressMutation,
    useUpdateExerciseProblemProgressMutation,
    useGetExerciseReportSummaryQuery,
    useGetExerciseProblemReportQuery,
    useGetExerciseReportQuery,
    useGetExerciseLandingPageQuery,
    useGetProblemSetDetailQuery,
    useLazyGetProblemSetDetailQuery,
    useGetExerciseProblemSolutionQuery
} = exerciseApi;

export const {
    getExerciseDetail,
    getExerciseHistory,
    getExerciseProblem,
    getExerciseReportSummary,
    getExerciseProblemReport,
    getLatestExerciseProblemProgress,
    getOrCreateExerciseProblemProgress,
    getExerciseLandingPage
} = exerciseApi.endpoints;
