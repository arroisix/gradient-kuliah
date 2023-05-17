import { baseApi } from 'redux/api/baseApi';

const PRIVATE_COURSE_BASE_URL = 'courses/private/';

export const privateCourseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivateListCourses: builder.query<
            ListResponseData<Course>,
            FilterCourseQueryParams
        >({
            query: (params: FilterCourseQueryParams) => ({
                url: `${PRIVATE_COURSE_BASE_URL}`,
                params
            })
        }),
        getPrivateCourse: builder.query<Course, string>({
            query: (id: string) => ({
                url: `${PRIVATE_COURSE_BASE_URL}${id}`
            })
        }),
        getSubchapterDetail: builder.query<SubChapter, string>({
            query: (id: string) => ({
                url: `${PRIVATE_COURSE_BASE_URL}subchapter/${id}`
            })
        }),
        getCourseNotebook: builder.query<Course, string>({
            query: (id: string) => ({
                url: `${PRIVATE_COURSE_BASE_URL}landing/${id}/notebook/`
            })
        }),
        submitPopupQuizAnswer: builder.mutation<
            PopupQuestionAnswerResponseData,
            PopupQuestionAnswerInputData
        >({
            query: (data: PopupQuestionAnswerInputData) => ({
                url: `${PRIVATE_COURSE_BASE_URL}save-popup-answer`,
                method: 'POST',
                body: data
            })
        })
    })
});

export const {
    useGetPrivateCourseQuery,
    useGetPrivateListCoursesQuery,
    useSubmitPopupQuizAnswerMutation,
    useGetSubchapterDetailQuery,
    useGetCourseNotebookQuery
} = privateCourseApi;
