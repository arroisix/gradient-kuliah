import { baseApi } from 'redux/api/baseApi';

const PUBLIC_COURSE_V2_BASE_URL = 'courses/v2/public/';

export const publicCourseV2Api = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicListCoursesV2: builder.query<
            ListResponseData<Course>,
            FilterCourseQueryParams
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PUBLIC_COURSE_V2_BASE_URL}`,
                params: {
                    ...params,
                    limit: 20,
                }
            })
        })
    })
});

export const { useGetPublicListCoursesV2Query } = publicCourseV2Api;

export const { getPublicListCoursesV2 } = publicCourseV2Api.endpoints;
