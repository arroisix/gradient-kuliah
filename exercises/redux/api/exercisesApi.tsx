import { baseApi } from 'redux/api/baseApi';
import {
    AstronotesExercise,
    CourseFilter,
    Exercise,
    ExerciseHistory,
    ExerciseLandingPage,
    ExerciseLandingPageV2,
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
        getExerciseDetail: builder.query<Exercise, { exercise_slug: string }>({
            query: ({ exercise_slug }) => ({
                url: `${EXERCISE_BASE_URL}${exercise_slug}/`
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
                url: `${EXERCISE_BASE_URL}${exercise_slug}/history/`
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
                url: `${EXERCISE_BASE_URL}${exercise_slug}/problems/${problem_id}/`
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
                url: `${EXERCISE_BASE_URL}${exercise_slug}/problems/${problem_id}/solution/`
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
                url: `${EXERCISE_BASE_URL}private/${exercise_slug}/progress/`
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
                url: `${EXERCISE_BASE_URL}private/${exercise_slug}/progress/`,
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
                url: `${EXERCISE_BASE_URL}private/${exercise_slug}/progress/${progress_id}/`,
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
                url: `${EXERCISE_BASE_URL}private/problem-progress/${problem_progress_id}/`
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
                url: `${EXERCISE_BASE_URL}private/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/`,
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
                url: `${EXERCISE_BASE_URL}private/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/${problem_progress_id}/`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_PROBLEM_${arg.problem_id}`
                },
                { type: 'PROBLEM_SET', id: 'LIST' },
                { type: 'ASTRONOTES', id: `EXERCISE_ENTRYPOINT` },
                { type: 'ASTRONOTES', id: `EXERCISE_${arg.exercise_slug}` }
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
                url: `${EXERCISE_BASE_URL}private/${exercise_slug}/progress/${exercise_progress_id}/problems/${problem_id}/progress/`,
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
                url: `${EXERCISE_BASE_URL}${exercise_slug}/progress/${exercise_progress_id}/summary/`
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
                url: `${EXERCISE_BASE_URL}${exercise_slug}/progress/${exercise_progress_id}/report/`
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
                url: `${EXERCISE_BASE_URL}${exercise_slug}/problems/${problem_id}/report/`
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
                url: `${EXERCISE_BASE_URL}`,
                params
            }),
            providesTags: () => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_ENTRYPOINT`
                }
            ]
        }),
        getExerciseV2LandingPage: builder.query<
            ExerciseLandingPageV2,
            {
                page?: number;
                limit?: number;
                status?: string;
                course_id?: string;
                university_name?: string;
                type?: string;
                sort?: string;
            }
        >({
            query: (params) => ({
                url: `${EXERCISE_BASE_URL}v2/`,
                params
            }),
            providesTags: () => [
                {
                    type: 'ASTRONOTES',
                    id: `EXERCISE_ENTRYPOINT`
                }
            ]
        }),
        getCoursesWithExercise: builder.query<ResponseData<CourseFilter>, void>(
            {
                query: () => ({
                    url: `${EXERCISE_BASE_URL}course-exercises/`
                })
            }
        ),
        getUniversitiesWithExercise: builder.query<
            ResponseData<string> & { default_value: string | null },
            void
        >({
            query: () => ({
                url: `${EXERCISE_BASE_URL}universities-exercises/`
            })
        }),
        getProblemSetDetail: builder.query<ProblemSetDetail, string>({
            query: (problemSetId) => ({
                url: `${EXERCISE_BASE_URL}problem-sets/${problemSetId}/`
            }),
            providesTags: [{ type: 'PROBLEM_SET', id: `LIST` }]
        }),

        getAstronotesExercises: builder.query<
            { exercises: AstronotesExercise[]; page_id?: string },
            { bookSlug: string; pageNumber: string }
        >({
            query: ({ bookSlug, pageNumber }) => ({
                url: `${EXERCISE_BASE_URL}astronotes/${bookSlug}/page/${pageNumber}/exercises/`
            })
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
    useGetExerciseProblemSolutionQuery,
    useGetAstronotesExercisesQuery,
    useGetExerciseV2LandingPageQuery,
    useGetCoursesWithExerciseQuery,
    useGetUniversitiesWithExerciseQuery
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
