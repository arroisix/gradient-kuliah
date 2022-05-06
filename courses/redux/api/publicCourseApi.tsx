import { baseApi } from 'redux/api/baseApi';

const PUBLIC_COURSE_BASE_URL = 'courses/public/';

export const publicCourseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicListCourses: builder.query<
            ListResponseData<Course>,
            FilterCourseQueryParams
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PUBLIC_COURSE_BASE_URL}`,
                params
            })
        }),
        getPublicCourse: builder.query<Course, string>({
            query: (id: string) => ({
                url: `${PUBLIC_COURSE_BASE_URL}${id}`
            })
        })
    })
});

export const { useGetPublicCourseQuery, useGetPublicListCoursesQuery } =
    publicCourseApi;

export const { getPublicListCourses, getPublicCourse } =
    publicCourseApi.endpoints;
