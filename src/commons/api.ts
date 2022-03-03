const API = {
    local: 'http://localhost:8000/graphql',
    dev: 'https://api-gradient.herokuapp.com/graphql',
    prod: 'https://api.gradient.academy/graphql'
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default API[process.env.NEXT_PUBLIC_NODE_ENV || 'local'];
