import { baseApi } from 'redux/api/baseApi';

const PRIVATE_COURSE_V3_BASE_URL = 'courses/v3/private/';

export const privateCourseV3Api = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivateListCoursesV3: builder.query<
            ListResponseData<CourseV3>,
            FilterCourseQueryParamsV3
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PRIVATE_COURSE_V3_BASE_URL}`,
                params
            })
        })
    })
});

export const {
    useGetPrivateListCoursesV3Query,
    useLazyGetPrivateListCoursesV3Query
} = privateCourseV3Api;
