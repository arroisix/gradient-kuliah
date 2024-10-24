export interface University {
    name: string;
    major: string;
}

export interface Image {
    url: string;
    alt: string;
}

export interface Testimonial {
    id: string;
    name: string;
    university: University;
    text: string;
    image: Image;
}