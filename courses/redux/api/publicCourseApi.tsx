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
        }),
        getLandingCourseListContent: builder.query<
            ResponseData<Chapter>,
            string
        >({
            query: (slug: string) => ({
                url: `${PUBLIC_COURSE_BASE_URL}landing/list-content/${slug}/`
            })
        }),
        getPublicCourseNotebook: builder.query<Course, string>({
            query: (id: string) => ({
                url: `${PUBLIC_COURSE_BASE_URL}landing/${id}/notebook/`
            })
        }),
        getListCourseChapter: builder.query<ResponseData<Chapter>, string>({
            query: (slug: string) => ({
                url: `${PUBLIC_COURSE_BASE_URL}list-chapter/${slug}/`
            })
        }),
        getListCourseSubChapter: builder.query<
            ResponseData<SubChapter>,
            string
        >({
            query: (id: string) => ({
                url: `${PUBLIC_COURSE_BASE_URL}list-subchapter/${id}/`
            })
        })
    })
});

export const {
    useGetPublicCourseQuery,
    useGetPublicListCoursesQuery,
    useGetLandingCourseDataQuery,
    useGetLandingCourseListContentQuery,
    useGetPublicCourseNotebookQuery,
    useGetListCourseChapterQuery,
    useGetListCourseSubChapterQuery
} = publicCourseApi;

export const { getPublicListCourses, getPublicCourse, getLandingCourseData } =
    publicCourseApi.endpoints;
