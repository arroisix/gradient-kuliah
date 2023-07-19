import { baseApi } from 'redux/api/baseApi';

const COURSE_BASE_URL = 'courses/';

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourse: builder.query<CoursesResponse, void>({
            query: () => ({ url: `${COURSE_BASE_URL}` })
        }),
        getCourseContent: builder.query<
            CourseContentResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({ url: `${COURSE_BASE_URL}${slug}/content/` })
        }),
        getSubchapter: builder.query<SubchapterResponse, { chapterId: string }>(
            {
                query: ({ chapterId }) => ({
                    url: `${COURSE_BASE_URL}${chapterId}/subchapter`
                })
            }
        ),
        getSearchCourseContent: builder.query<
            SearchCourseResponse,
            {
                slug: string;
                content_type?: 'CHAPTER' | 'SUBCHAPTER' | 'BOOK';
                page?: number;
                limit?: number;
            }
        >({
            query: ({ slug, ...payload }) => ({
                url: `${COURSE_BASE_URL}${slug}content/search/`,
                body: { ...payload }
            })
        }),
        getCourseDetail: builder.query<CourseDetailResponse, { slug: string }>({
            query: ({ slug }) => ({ url: `${COURSE_BASE_URL}${slug}` })
        }),
        postCourseFeedback: builder.mutation<CourseFeedback, CourseFeedback>({
            query: (body) => ({
                url: `${COURSE_BASE_URL}feedback/`,
                method: 'POST',
                body
            })
        })
    })
});
