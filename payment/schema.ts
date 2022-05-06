import { gql } from '@apollo/client';

export const GET_ALL_TRANSACTION = gql`
    query Transaction {
        transactions {
            id
            createdAt
            status
            amount
            vaNumber
            deadline
            paymentMethod
            subscriber {
                subscribedPacket {
                    id
                    price
                    activeDuration
                    isLifetime
                    courses {
                        id
                        courseName
                    }
                }
            }
        }
    }
`;

export const GET_TRANSACTION = gql`
    query Transaction($id: String) {
        transaction(id: $id) {
            id
            createdAt
            status
            amount
            vaNumber
            deadline
            paymentMethod
            subscriber {
                subscribedPacket {
                    id
                    price
                    activeDuration
                    isLifetime
                    courses {
                        id
                        courseName
                    }
                }
            }
        }
    }
`;

export const GET_COURSE_PACKET = gql`
    query CoursePacket($id: String) {
        onePacketOneCourse(courseId: $id) {
            id
            price
            packetName
            activeDuration
            isLifetime
            courses {
                id
                courseName
            }
        }
    }
`;

export const CHECKOUT = gql`
    mutation Checkout(
        $packetId: String!
        $paymentMethod: PaymentMethod!
        $phoneNumber: String
    ) {
        subscribePacket(
            packetId: $packetId
            paymentMethod: $paymentMethod
            phoneNumber: $phoneNumber
        ) {
            transaction {
                id
            }
        }
    }
`;
