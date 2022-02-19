import { gql } from '@apollo/client';

export const GET_PUBLIC_COURSE = gql`
    query AllCourse {
        allCourses {
            edges {
                node {
                    uuid
                    courseName
                    thumbnail
                }
            }
        }
    }
`;

export const GET_PRIVATE_COURSE = gql`
    query AllCourse {
        authAllCourses {
            edges {
                node {
                    uuid
                    courseName
                    isSubscribed
                    thumbnail
                }
            }
        }
    }
`;

export const GET_PUBLIC_DETAIL_COURSE = gql`
    query Course($id: String) {
        course(id: $id) {
            id
            uuid
            courseName
            trailer
            thumbnail
            banner
            shortDescription
            description
            price
            lecturers {
                name
                photo
                role
            }
            chapters {
                id
                order
                chapterName
                subchapters {
                    id
                    thumbnail
                    order
                    subchapterName
                    video {
                        id
                        duration
                        isFree
                        thumbnail
                        videoUrl
                    }
                    notebook {
                        id
                        title
                        isFree
                    }
                }
            }
        }
    }
`;

export const GET_PRIVATE_DETAIL_COURSE = gql`
    query Course($id: String) {
        authCourse(id: $id) {
            id
            uuid
            courseName
            trailer
            thumbnail
            banner
            shortDescription
            description
            price
            isSubscribed
            lecturers {
                name
                photo
                role
            }
            chapters {
                id
                order
                chapterName
                subchapters {
                    id
                    thumbnail
                    order
                    subchapterName
                    video {
                        id
                        duration
                        isFree
                        thumbnail
                        videoUrl
                    }
                    notebook {
                        id
                        title
                        isFree
                    }
                }
            }
        }
    }
`;
