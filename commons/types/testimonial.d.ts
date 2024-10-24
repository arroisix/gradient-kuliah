export interface TestimonialUniversity {
    name: string;
    major: string;
}

export interface TestimonialImage {
    url: string;
    alt: string;
}

export interface Testimonial {
    id: string;
    name: string;
    university: TestimonialUniversity;
    text: string;
    image: TestimonialImage;
}
