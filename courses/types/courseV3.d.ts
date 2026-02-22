interface FilterCourseQueryParamsV3 {
    page?: int;
    limit?: int;
    category?: string;
    search?: string;
}

type CourseV3 = {
    id: string;
    course_name: string;
    thumbnail: string;
    is_free: boolean;
    lecturers: Lecturer[];
    latest_subchapter_slug?: string;
    slug: string;
    clusters: string[];
}