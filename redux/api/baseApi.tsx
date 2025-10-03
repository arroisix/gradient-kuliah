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
// import { updateToken } from 'authentication/redux/slices/userSlice';
import FingerPrintJS from '@fingerprintjs/fingerprintjs';

async function getBrowserFingerPrint() {
    const fp = await FingerPrintJS.load();
    const { visitorId } = await fp.get();
    return visitorId;
}

// const baseQuery = fetchBaseQuery({
//     baseUrl: config.API_BASE_URL,
//     prepareHeaders: async (headers, { getState, endpoint }) => {
//         const token = (getState() as RootState).authentication.user.token;
//         const rawToken =
//             typeof window !== 'undefined'
//                 ? window.localStorage.getItem('token')
//                 : null;

//         if (token || rawToken) {
//             headers.set('Authorization', `Token ${token ?? rawToken}`);
//         }

//         if (
//             endpoint === 'login' ||
//             endpoint === 'register' ||
//             endpoint === 'socialLogin'
//         ) {
//             const did = await getBrowserFingerPrint();
//             headers.set('did', did);
//         }
//         return headers;
//     }
// });

// const performLogout = async () => {
//     try {
//         await fetch(`${config.API_BASE_URL}identities/logout/`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Token ${localStorage.getItem('token')}`,
//             }
//         });
//     } catch (error) {
//         console.error('Logout API call failed:', error);
//     } finally {
//         localStorage.clear();
//         if (typeof window !== 'undefined') {
//             window.location.href = '/masuk';
//         }
//     }
// };

// const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
//     let result = await baseQuery(args, api, extraOptions);

//     if (result.error?.status === 401) {
//         const refreshToken = localStorage.getItem('refresh_token');

//         if (refreshToken) {
//             try {
//                 const refreshResult = await fetch(`${config.API_BASE_URL}identities/refresh-token/`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'did': await getBrowserFingerPrint()
//                     },
//                     body: JSON.stringify({ refresh_token: refreshToken })
//                 });

//                 if (refreshResult.ok) {
//                     const refreshData = await refreshResult.json();

//                     localStorage.setItem('token', refreshData.access_token);
//                     api.dispatch(updateToken(refreshData.access_token));

//                     result = await baseQuery(args, api, extraOptions);
//                 } else {
//                     await performLogout();
//                 }
//             } catch (error) {
//                 await performLogout();
//             }
//         } else {
//             await performLogout();
//         }
//     }

//     return result;
// };

export const baseApi = createApi({
    tagTypes: [
        'QNA_QUESTION',
        'QNA_ANSWER',
        'EXAM_QUESTION',
        'AI_TUTOR',
        'WATCH_PROGRESS',
        'CODING_PROGRESS',
        'PROFILE',
        'COMMUNITIES',
        'ASTRONOTES',
        'PROBLEM_SET',
        'CONNECTED_DEVICES',
        'TRANSACTION',
        'CHAT_HISTORY',
        'FLASHCARD',
        'FLASHCARD_CARD',
        'FLASHCARD_LIST',
        'LAST_SEEN_FLASHCARDS',
        'CONTEXT_RECOMMENDATION',
        'TEXTBOOK_CHAPTERS',
        'TEXTBOOK_SECTIONS',
        'TEXTBOOK_PROBLEMS',
        'COURSE_CHAPTERS',
        'COURSE_SUBCHAPTERS',
        'ASTRONOTES_CHAPTERS',
        'ASTRONOTES_SUBCHAPTERS',
        'ASTRONOTES_TOPICS',
        'BANKSOAL_CHAPTERS',
        'BANKSOAL_SECTIONS',
        'BANKSOAL_PROBLEMS',
        'CONTENT_SEARCH',
        'USER_CARDS',
        'ANNOUNCEMENTS'
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

            if (
                endpoint === 'login' ||
                endpoint === 'register' ||
                endpoint === 'socialLogin'
            ) {
                const did = await getBrowserFingerPrint();
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
