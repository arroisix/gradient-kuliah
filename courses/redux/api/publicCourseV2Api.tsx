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
                params
            })
        }),
        getPublicSubchapterDetailV2: builder.query<
            SubChapter,
            { course_slug: string; subchapter_slug: string }
        >({
            query: ({ course_slug, subchapter_slug }) => ({
                url: `${PUBLIC_COURSE_V2_BASE_URL}${course_slug}/subchapter/${subchapter_slug}/`
            })
        })
    })
});

export const {
    useGetPublicListCoursesV2Query,
    useLazyGetPublicListCoursesV2Query,
    useGetPublicSubchapterDetailV2Query
} = publicCourseV2Api;

export const { getPublicListCoursesV2 } = publicCourseV2Api.endpoints;
