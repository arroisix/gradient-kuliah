import { baseApi } from 'redux/api/baseApi';
import {
    BannerResponse,
    GetClassProgressResponse,
    GetDashboardContentResponse,
    LearnRecommendationResponse,
    MajorClassesResponse,
    MajorRecommendationResponse,
    StudentCourseResponse,
    StudentLearningProgressResponse,
    UserBooksResponse,
    UserClassesResponse,
    UserFlashcardsResponse,
    UserQuizResponse
} from '../../types/dashboard';

const STUDENT_BASE_URL = 'students/';
const LEARNING_BASE_URL = 'learning-experiences/';
const LEARNING_V2_BASE_URL = 'learning-experiences/v2/';

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStudentLearningProgress: builder.query<
            StudentLearningProgressResponse,
            void
        >({
            query: () => ({
                url: `${STUDENT_BASE_URL}learning-progress/`
            })
        }),
        getStudentCourse: builder.query<StudentCourseResponse, void>({
            query: () => ({
                url: `${STUDENT_BASE_URL}course/`
            })
        }),
        getDashboardContent: builder.query<
            GetDashboardContentResponse,
            { type?: string }
        >({
            query: ({ type }) => ({
                url: `${LEARNING_BASE_URL}dashboard/`,
                params: { type: type }
            }),
            providesTags: [{ type: 'PROFILE', id: 'DASHBOARD' }]
        }),
        getClassProgress: builder.query<
            GetClassProgressResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${LEARNING_BASE_URL}class-progress/${slug}/`
            })
        }),
        updateMyClasses: builder.mutation<
            Pick<GetDashboardContentResponse, 'my_class'>,
            { deleted_course_slug: string[] }
        >({
            query: (body) => ({
                url: `${LEARNING_BASE_URL}class-status/`,
                method: 'PUT',
                body
            }),
            invalidatesTags: [{ type: 'PROFILE', id: 'DASHBOARD' }]
        }),

        getBanner: builder.query<BannerResponse, void>({
            query: () => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/banner/`
            }),
            providesTags: [{ type: 'PROFILE', id: 'BANNER' }]
        }),

        getUserClasses: builder.query<
            UserClassesResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/user-classes/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'USER_CLASSES' }]
        }),

        getUserBooks: builder.query<
            UserBooksResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/user-books/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'USER_BOOKS' }]
        }),

        getUserFlashcards: builder.query<
            UserFlashcardsResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/user-flashcards/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'USER_FLASHCARDS' }]
        }),

        getUserQuiz: builder.query<
            UserQuizResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/user-quiz/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'USER_QUIZ' }]
        }),

        getMajorClasses: builder.query<
            MajorClassesResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/major_classes/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_CLASSES' }]
        }),

        getMajorRecommendation: builder.query<
            MajorRecommendationResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/major_recommendation/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_RECOMMENDATION' }]
        }),

        getLearnRecommendation: builder.query<
            LearnRecommendationResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/learn_recommendation/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'LEARN_RECOMMENDATION' }]
        })
    })
});

export const {
    useGetStudentLearningProgressQuery,
    useGetStudentCourseQuery,
    useGetClassProgressQuery,
    useGetDashboardContentQuery,
    useUpdateMyClassesMutation,
    useGetBannerQuery,
    useGetUserClassesQuery,
    useGetUserBooksQuery,
    useGetUserFlashcardsQuery,
    useGetUserQuizQuery,
    useGetMajorClassesQuery,
    useGetMajorRecommendationQuery,
    useGetLearnRecommendationQuery
} = dashboardApi;
