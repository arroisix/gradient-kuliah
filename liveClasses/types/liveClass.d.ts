type LiveClass = {
    id: string;
    name: string;
    slug: string;
    description: string;
    starts_at: string;
    duration: number; // duration in minutes
    lecturers: Lecturer[];
    related_courses: string;
};

type LiveClassAuthenticated = LiveClass & {
    is_registered: boolean;
    meet_link: string;
};