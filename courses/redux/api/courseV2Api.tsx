import { baseApi } from 'redux/api/baseApi';

const COURSE_V2_BASE_URL = 'courses/v2/';

export const courseV2Api = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourseProgressV2: builder.query<CourseProgress[], void>(
            {
                query: () => ({
                    url: `${COURSE_V2_BASE_URL}progress/`
                })
            }
        ),
    })
});

export const {
    useGetCourseProgressV2Query,
} = courseV2Api;
