import { gql } from '@apollo/client';

export const GET_COURSE_PACKET = gql`
    query CoursePacket($id: String) {
        onePacketOneCourse(courseId: $id) {
            id
            price
            packetName
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
                status
                amount
                vaNumber
                deadline
                paymentMethod
            }
        }
    }
`;
