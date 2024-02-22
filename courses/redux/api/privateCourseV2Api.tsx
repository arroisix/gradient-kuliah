import { baseApi } from 'redux/api/baseApi';

const PRIVATE_COURSE_V2_BASE_URL = 'courses/v2/private/';

export const privateCourseV2Api = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivateListCoursesV2: builder.query<
            ListResponseData<Course>,
            FilterCourseQueryParams
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PRIVATE_COURSE_V2_BASE_URL}`,
                params
            })
        })
    })
});

export const { useGetPrivateListCoursesV2Query } = privateCourseV2Api;
