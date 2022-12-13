const config = {
    prod: {
        API_BASE_URL: 'https://api.gradient.academy/'
    },
    dev: {
        API_BASE_URL: 'https://braided-circuit-360607.et.r.appspot.com/'
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
