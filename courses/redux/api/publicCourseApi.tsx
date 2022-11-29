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
        }),
        getLandingCourseData: builder.query<CourseLandingPageData, string>({
            query: (slug: string) => ({
                url: `${PUBLIC_COURSE_BASE_URL}landing/${slug}`
            })
        })
    })
});

export const {
    useGetPublicCourseQuery,
    useGetPublicListCoursesQuery,
    useGetLandingCourseDataQuery
} = publicCourseApi;

export const { getPublicListCourses, getPublicCourse, getLandingCourseData } =
    publicCourseApi.endpoints;
