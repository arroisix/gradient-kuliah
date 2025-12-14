import { baseApi } from 'redux/api/baseApi';
import {
    AnnouncementItem,
    BannerResponse,
    FreeForYouResponse,
    GetClassProgressResponse,
    GetDashboardContentResponse,
    LearnRecommendationResponse,
    MajorBooksResponse,
    MajorClassesResponse,
    MajorFlashcardsResponse,
    MajorQuizResponse,
    MajorRecommendationResponse,
    NewlyReleasedForYouResponse,
    PaginatedResponse,
    StudentCourseResponse,
    StudentLearningProgressResponse,
    StudentTargetInstitution,
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

        getBanner: builder.query<
            BannerResponse,
            { type: 'campaign' | 'general' }
        >({
            query: ({ type }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/banner/`,
                params: { type }
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
                url: `${LEARNING_V2_BASE_URL}dashboard/major-classes/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_CLASSES' }]
        }),

        getMajorRecommendation: builder.query<
            MajorRecommendationResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/major-trending/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_RECOMMENDATION' }]
        }),

        getLearnRecommendation: builder.query<
            LearnRecommendationResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 3 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/learn-recommendation/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'LEARN_RECOMMENDATION' }]
        }),

        getNewlyReleasedForYou: builder.query<
            NewlyReleasedForYouResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: (params = { page: 1, limit: 6 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/newly-released-for-you/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'NEWLY_RELEASED_FOR_YOU' }]
        }),
        getMajorBooks: builder.query<
            MajorBooksResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/major-books/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_BOOKS' }]
        }),

        getMajorFlashcards: builder.query<
            MajorFlashcardsResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/major-flashcards/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_FLASHCARDS' }]
        }),

        getMajorQuiz: builder.query<
            MajorQuizResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/major-quiz/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'MAJOR_QUIZ' }]
        }),

        getFreeForYouContent: builder.query<
            FreeForYouResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/free-for-you/`,
                params
            }),
            providesTags: [{ type: 'PROFILE', id: 'FREE_FOR_YOU' }]
        }),

        getPopularClassesPublic: builder.query<
            PaginatedResponse<{
                id: string;
                course_slug: string;
                course_name: string;
                thumbnail: string;
            }>,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/popular-classes/`,
                params
            })
        }),
        getNewlyReleasedPublic: builder.query<
            NewlyReleasedForYouResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 6 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/newly-released-public/`,
                params
            })
        }),
        getPublicBooks: builder.query<
            NewlyReleasedForYouResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/books-and-question-banks/`,
                params
            })
        }),
        getPublicQuiz: builder.query<
            MajorQuizResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/public-quiz/`,
                params
            })
        }),
        getPublicFlashcards: builder.query<
            MajorFlashcardsResponse,
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 12 }) => ({
                url: `${LEARNING_V2_BASE_URL}dashboard/public-flashcards/`,
                params
            })
        }),
        getAnnouncements: builder.query<ResponseData<AnnouncementItem>, void>({
            query: () => ({
                url: `${LEARNING_BASE_URL}announcements/`
            }),
            providesTags: ['ANNOUNCEMENTS']
        }),
        storeUserAnnouncement: builder.mutation<
            void,
            { announcement_ids: string[] }
        >({
            query: (body) => ({
                url: `${LEARNING_BASE_URL}announcements/store/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['ANNOUNCEMENTS']
        }),
        getStudentTargetInstitutions: builder.query<
            StudentTargetInstitution[],
            void
        >({
            query: () => ({
                url: `${STUDENT_BASE_URL}target-institutions/`
            })
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
    useGetLearnRecommendationQuery,
    useGetNewlyReleasedForYouQuery,
    useGetMajorBooksQuery,
    useGetMajorFlashcardsQuery,
    useGetMajorQuizQuery,
    useGetFreeForYouContentQuery,
    useGetPopularClassesPublicQuery,
    useGetNewlyReleasedPublicQuery,
    useGetPublicBooksQuery,
    useGetPublicQuizQuery,
    useGetPublicFlashcardsQuery,
    useGetAnnouncementsQuery,
    useStoreUserAnnouncementMutation,
    useGetStudentTargetInstitutionsQuery
} = dashboardApi;
