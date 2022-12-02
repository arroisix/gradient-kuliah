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
    | `hero_${string}`
    | `video_${string}`
    | `benefit_${string}`
    | `lecturers_${string}`
    | `price_table_${string}`
    | `price_highlight_${string}`;

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
    trailer?: string;
    lecturers: Lecturer[];
    configuration: CourseLandingPageConfig;
    packets: Packet[];
}
