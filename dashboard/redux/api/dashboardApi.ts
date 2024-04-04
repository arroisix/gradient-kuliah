import { baseApi } from 'redux/api/baseApi';

const STUDENT_BASE_URL = 'students/';
const LEARNING_BASE_URL = 'learning-experiences/';

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
        getDashboardContent: builder.query<GetDashboardContentResponse, void>({
            query: () => ({
                url: `${LEARNING_BASE_URL}dashboard/`
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
        })
    })
});

export const {
    useGetStudentLearningProgressQuery,
    useGetStudentCourseQuery,
    useGetClassProgressQuery,
    useGetDashboardContentQuery,
    useUpdateMyClassesMutation
} = dashboardApi;
