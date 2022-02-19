type Course = {
    uuid: string;
    id: string;
    courseName: string;
    trailer: string;
    shortDescription: string;
    isSubscribed: boolean;
    description: string;
    chapters: [Chapter];
    banner: string;
    thumbnail: string;
    lecturers: [Lecturer];
};

type CourseNode = {
    node: Course;
};

type Lecturer = {
    name: string;
    photo: string;
    role: string;
};

type Chapter = {
    id: string;
    chapterName: string;
    order: int;
    subchapters: [SubChapter];
};

type SubChapter = {
    id: string;
    order: int;
    subchapterName: string;
    notebook?: Notebook;
    video?: Video;
};

type Notebook = {
    id: string;
    isFree: boolean;
    title: string;
};

type Video = {
    id: string;
    videoUrl: string;
    isFree: boolean;
    duration: string;
    thumbnail: string;
};
