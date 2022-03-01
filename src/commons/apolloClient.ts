import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    from
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { toast } from 'react-toastify';

const httpLink = createHttpLink({
    uri: `${process.env.API_ENDPOINT}/graphql`
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : ''
        }
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
            toast.error(message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        });

    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        toast.error(networkError, {
            position: toast.POSITION.BOTTOM_CENTER
        });
    }
});

const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache()
});

export const publicClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache()
});

export default client;
