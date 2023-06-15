import { baseApi } from 'redux/api/baseApi';

const STUDENT_BASE_URL = 'students/';

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
        })
    })
});

export const { useGetStudentLearningProgressQuery, useGetStudentCourseQuery } =
    dashboardApi;
