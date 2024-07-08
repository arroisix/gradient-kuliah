type CourseFaq = {
    answer: string;
    question: string;
};

type LandingPageSectionKey =
    | 'hero'
    | 'video'
    | 'benefit'
    | 'lecturers'
    | 'price_table'
    | 'testimony'
    | 'price_highlight'
    | 'faq'
    | 'poster'
    | `hero_${string}`
    | `video_${string}`
    | `benefit_${string}`
    | `lecturers_${string}`
    | `price_table_${string}`
    | `price_highlight_${string}`
    | `poster_${string}`;

type LandingPageSection = {
    key: LandingPageSectionKey;
    [string]?: string;
};

type CourseLandingPageConfig = {
    landing_page_section: LandingPageSection[];
};

type TestimonyData = {
    testimony: string;
    name: string;
    role: string;
    photo: string;
};

interface CourseLandingPageData {
    course_id: string;
    course_slug: string;
    course_name: string;
    description: string;
    cover: string;
    trailer?: string;
    lecturers: Lecturer[];
    configuration: CourseLandingPageConfig;
    packets: Packet[];
    is_coming_soon: boolean;
    is_waiting_list: boolean;
}

interface MajorOptions {
    label: string;
    slug: string;
}

interface MajorOptions {
    label: string;
    slug: string;
}

interface GetCourseRatingResponse {
    average_rating: number;
    rating_count: number;
    best_rating: number;
    worst_rating: number;
}
