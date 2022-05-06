interface FilterCourseQueryParams {
    page?: int;
    limit?: int;
    is_subscribed?: boolean;
    keyword?: string;
}

type Course = {
    id: string;
    course_name: string;
    trailer: string;
    short_description: string;
    is_subscribed: boolean;
    description: string;
    chapters: Chapter[];
    banner: string;
    thumbnail: string;
    lecturers: Lecturer[];
};

type Lecturer = {
    name: string;
    photo: string;
    role: string;
};

type Chapter = {
    id: string;
    chapter_name: string;
    order: int;
    subchapters: SubChapter[];
};

type SubChapter = {
    id: string;
    order: int;
    type_name: 'lecture' | 'exercise';
    subchapter_name: string;
    notebook?: Notebook;
    video?: Video;
};

type Notebook = {
    id: string;
    is_free: boolean;
    title: string;
    content: string;
    authors: Lecturer[];
    created_at: string | Date;
    references: string;
    thumbnail: string;
};

type Video = {
    id: string;
    video_url: string;
    is_free: boolean;
    duration: string;
    thumbnail: string;
    description: string;
    lecturers?: Lecturer[];
};

type Packet = {
    id: string;
    is_free: string;
    packet_name: string;
    active_duration: number;
    is_lifetime: boolean;
    price: string;
    courses: Course[];
};
