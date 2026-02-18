import { baseApi } from 'redux/api/baseApi';

const PUBLIC_COURSE_V3_BASE_URL = 'courses/v3/public/';

export const publicCourseV3Api = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicListCoursesV3: builder.query<
            ListResponseData<CourseV3>,
            FilterCourseQueryParamsV3
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PUBLIC_COURSE_V3_BASE_URL}`,
                params
            })
        })
    })
});

export const {
    useGetPublicListCoursesV3Query,
    useLazyGetPublicListCoursesV3Query
} = publicCourseV3Api;

export const { getPublicListCoursesV3 } = publicCourseV3Api.endpoints;