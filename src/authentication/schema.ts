import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            payload
            token
        }
    }
`;

export const REGISTER = gql`
    mutation Register($email: String!, $password: String!, $fullName: String!) {
        register(email: $email, password: $password, fullName: $fullName) {
            payload {
                id
                email
                fullName
                phoneNumber
            }
            token
        }
    }
`;

export const GOOGLE_LOGIN = gql`
    mutation GoogleLogin($token: String!) {
        googleLogin(accessToken: $token) {
            payload {
                id
                email
                fullName
                phoneNumber
            }
            token
            isNewUser
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($data: UserUpdateInput!) {
        userUpdate(data: $data) {
            payload {
                id
                fullName
                phoneNumber
                email
            }
        }
    }
`;
