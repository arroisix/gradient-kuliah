const config = {
    prod: {
        API_BASE_URL: 'https://gradient-infra-prod.et.r.appspot.com/'
    },
    dev: {
        API_BASE_URL: 'https://api-dev.gradient.academy/'
    },
    local: {
        API_BASE_URL: 'http://localhost:8000/'
    }
};

export default {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...config[process.env.NEXT_PUBLIC_NODE_ENV || 'local']
};
