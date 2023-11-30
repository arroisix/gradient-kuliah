/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery
 * https://gist.github.com/JNaftali/6b7ca6be39a1374c346c70cd1883bba5
 * https://github.com/phryneas/ssr-experiments/blob/main/nextjs-blog/pages/_app.js
 * https://github.com/reduxjs/redux-toolkit/issues/1271
 */
import AbortController from 'abort-controller';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.AbortController = AbortController;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from './config';
import { HYDRATE } from 'next-redux-wrapper';
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';

export const baseApi = createApi({
    tagTypes: [
        'QNA_QUESTION',
        'QNA_ANSWER',
        'EXAM_QUESTION',
        'AI_TUTOR',
        'WATCH_PROGRESS',
        'PROFILE',
        'COMMUNITIES',
        'ASTRONOTES'
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: config.API_BASE_URL,
        prepareHeaders: async (headers, { getState, endpoint }) => {
            const token = (getState() as RootState).authentication.user.token;
            const rawToken =
                typeof window !== 'undefined'
                    ? window.localStorage.getItem('token')
                    : null;

            if (token || rawToken) {
                headers.set('Authorization', `Token ${token ?? rawToken}`);
            }

            if (endpoint === 'login') {
                const did = await getCurrentBrowserFingerPrint();
                headers.set('did', did);
            }
            return headers;
        }
    }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    endpoints: () => ({})
});

export const { getRunningQueriesThunk } = baseApi.util;
