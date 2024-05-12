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
        getCoursePreview: builder.query<FirstVideoInCourse, { slug: string }>({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}public/${slug}/preview/`
            })
        }),
        getSubchapter: builder.query<SubchapterResponse, { chapterId: string }>(
            {
                query: ({ chapterId }) => ({
                    url: `${COURSE_BASE_URL}${chapterId}/subchapter/`
                }),
                providesTags: (result) =>
                    result
                        ? [
                              ...result.subchapters.map(({ video_id }) => ({
                                  type: 'WATCH_PROGRESS' as const,
                                  id: video_id
                              }))
                          ]
                        : [{ type: 'WATCH_PROGRESS', id: 'LIST' }]
            }
        ),
        getPublicSubchapterDetail: builder.query<SubChapter, string>({
            query: (id: string) => ({
                url: `${COURSE_BASE_URL}public/subchapter/${id}/`
            })
        }),
        getSearchCourseContent: builder.query<
            SearchCourseResponse,
            {
                slug: string;
                content: string;
                type?: 'CHAPTER' | 'SUBCHAPTER' | 'BOOK';
                page?: number;
                limit?: number;
            }
        >({
            query: ({ slug, ...payload }) => ({
                url: `${COURSE_BASE_URL}${slug}/content/search/`,
                params: { ...payload }
            }),
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                return endpointName + queryArgs.content + queryArgs.slug;
            },
            merge: (currentCache, newItems, otherArgs) => {
                if (
                    newItems?.books?.contents &&
                    currentCache.books.next_page !== newItems.books.next_page &&
                    otherArgs.arg.page !== 1
                ) {
                    currentCache?.books?.contents?.push(
                        ...newItems?.books?.contents
                    );
                    currentCache.books.next_page = newItems.books.next_page;
                }
                if (
                    newItems?.chapters?.contents &&
                    currentCache.chapters.next_page !==
                        newItems.chapters.next_page &&
                    otherArgs.arg.page !== 1
                ) {
                    currentCache?.chapters?.contents?.push(
                        ...newItems?.chapters?.contents
                    );
                    currentCache.chapters.next_page =
                        newItems.chapters.next_page;
                }
                if (
                    newItems?.subchapters?.contents &&
                    currentCache.subchapters.next_page !==
                        newItems.subchapters.next_page &&
                    otherArgs.arg.page !== 1
                ) {
                    const currentLength =
                        currentCache.subchapters.contents.length;
                    const newLength = newItems.subchapters.contents.length;
                    let indexNotAdded = 0;
                    for (let i = 0; i < currentLength; i++) {
                        for (let j = indexNotAdded; j < newLength; j++) {
                            if (
                                currentCache.subchapters.contents[i]
                                    ?.chapter ===
                                newItems.subchapters.contents[i]?.chapter
                            ) {
                                currentCache.subchapters.contents[i].items.push(
                                    ...newItems.subchapters.contents[i].items
                                );
                                indexNotAdded++;
                            }
                        }
                    }
                    for (let k = indexNotAdded; k < newLength; k++) {
                        currentCache?.subchapters?.contents.push(
                            newItems.subchapters.contents[k]
                        );
                    }
                    currentCache.subchapters.next_page =
                        newItems.subchapters.next_page;
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            }
        }),
        getCourseDetail: builder.query<CourseDetailResponse, { slug: string }>({
            query: ({ slug }) => ({ url: `${COURSE_BASE_URL}${slug}/` })
        }),
        getPublicCourseDetail: builder.query<
            CourseDetailResponse,
            { slug: string }
        >({
            query: ({ slug }) => ({ url: `${COURSE_BASE_URL}public/${slug}` })
        }),
        postCourseFeedback: builder.mutation<
            CourseFeedback,
            CourseFeedback & { slug: string }
        >({
            query: ({ slug, ...body }) => ({
                url: `${COURSE_BASE_URL}${slug}/feedback/`,
                method: 'POST',
                body
            })
        }),
        addToWaitingList: builder.mutation<
            { student_id: string; course_slug: string },
            { slug: string }
        >({
            query: ({ slug }) => ({
                url: `${COURSE_BASE_URL}waiting-list/`,
                method: 'POST',
                body: {
                    course_slug: slug
                }
            })
        }),
        getBookContent: builder.query<
            BookResponse,
            { slug: string; book_id: string }
        >({
            query: ({ slug, book_id }) => ({
                url: `${COURSE_BASE_URL}${slug}/book/${book_id}`
            })
        })
    })
});

export const {
    useGetCourseQuery,
    useGetCourseContentQuery,
    useGetCoursePreviewQuery,
    useGetSubchapterQuery,
    useGetPublicSubchapterDetailQuery,
    useGetSearchCourseContentQuery,
    useGetCourseDetailQuery,
    usePostCourseFeedbackMutation,
    useAddToWaitingListMutation,
    useGetBookContentQuery,
    useLazyGetSearchCourseContentQuery
} = courseApi;
