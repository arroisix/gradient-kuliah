import { baseApi } from 'redux/api/baseApi';

const PRIVATE_COURSE_BASE_URL = 'courses/private/';

export const privateCourseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivateListCourses: builder.query<
            ListResponseData<Course>,
            FilterCourseQueryParams
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PRIVATE_COURSE_BASE_URL}`,
                params
            })
        }),
        getPrivateCourse: builder.query<Course, string>({
            query: (id: string) => ({
                url: `${PRIVATE_COURSE_BASE_URL}${id}`
            })
        })
    })
});

export const { useGetPrivateCourseQuery, useGetPrivateListCoursesQuery } =
    privateCourseApi;
