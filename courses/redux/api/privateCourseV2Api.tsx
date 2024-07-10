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
        }),
        getSubchapterDetailV2: builder.query<
            SubChapter,
            { course_slug: string; subchapter_slug: string }
        >({
            query: ({ course_slug, subchapter_slug }) => ({
                url: `${PRIVATE_COURSE_V2_BASE_URL}${course_slug}/subchapter/${subchapter_slug}/`
            })
        })
    })
});

export const {
    useGetPrivateListCoursesV2Query,
    useGetSubchapterDetailV2Query
} = privateCourseV2Api;
