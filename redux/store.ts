/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    persistStore
} from 'redux-persist';

import rootReducer from './reducers';

import { createWrapper } from 'next-redux-wrapper';
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import logger from 'redux-logger';

import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { clearCache } from 'authentication/redux/slices/userSlice';
import { authApi } from 'authentication/redux/api/authApi';

/**
 * Log a warning and show a toast!
 */

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
        try {
            const { status } = action.payload;

            if (status === 'PARSING_ERROR') {
                const { originalStatus } = action.payload;

                if (originalStatus === 404) {
                    toast.error('Data yang anda cari tidak ditemukan', {
                        position: 'top-center',
                        theme: 'colored',
                        hideProgressBar: true,
                        toastId: originalStatus
                    });
                }

                if (originalStatus >= 500) {
                    toast.error(
                        'Terjadi kesalahan pada server, mohon coba beberapa saat lagi',
                        {
                            position: 'top-center',
                            theme: 'colored',
                            hideProgressBar: true,
                            toastId: 'SERVER ERROR'
                        }
                    );
                }
            } else if (status !== 'FETCH_ERROR' && isNaN(status)) {
                const { errors } = action.payload.data as GradientError;

                if (errors.validation_error === null) {
                    toast.error(errors.error_message, {
                        position: 'top-center',
                        theme: 'colored',
                        hideProgressBar: true,
                        toastId: status
                    });
                } else {
                    Object.keys(errors.validation_error).map((key) => {
                        if (Array.isArray(errors.validation_error[key])) {
                            toast.error(
                                `${key} : ${errors.validation_error[key][0]}`,
                                {
                                    position: 'top-center',
                                    theme: 'colored',
                                    hideProgressBar: true,
                                    toastId: key
                                }
                            );
                        } else {
                            toast.error(
                                `${key} : ${errors.validation_error[key]}`,
                                {
                                    position: 'top-center',
                                    theme: 'colored',
                                    hideProgressBar: true,
                                    toastId: key
                                }
                            );
                        }
                    });
                }
            } else if (status >= 400 && status < 500) {
                const { data } = action.payload;

                if (Object.keys(data).length > 0) {
                    Object.keys(data).map((key) => {
                        if (Array.isArray(data[key])) {
                            toast.error(`${key} : ${data[key][0]}`, {
                                position: 'top-center',
                                theme: 'colored',
                                hideProgressBar: true,
                                toastId: key
                            });
                        } else {
                            toast.error(`${data[key]}`, {
                                position: 'top-center',
                                theme: 'colored',
                                hideProgressBar: true,
                                toastId: key
                            });
                        }
                    });
                }
            } else {
                toast.error(
                    'Terjadi kesalahan pada server, mohon coba beberapa saat lagi',
                    {
                        position: 'top-center',
                        theme: 'colored',
                        hideProgressBar: true,
                        toastId: 'SERVER ERROR'
                    }
                );
            }
        } catch (e) {
            toast.error(
                'Terjadi kesalahan pada server, mohon coba beberapa saat lagi',
                {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true,
                    toastId: 'SERVER ERROR'
                }
            );
        }
    }

    return next(action);
};

const middleware = (getDefaultMiddleware: CurriedGetDefaultMiddleware) => {
    const middlewareArray = [
        ...getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        }),
        authApi.middleware
    ];

    middlewareArray.push(rtkQueryErrorLogger);

    if (process.env.NODE_ENV === 'development') {
        middlewareArray.push(logger);
    }
    return middlewareArray;
};

const useStore = () => {
    const isServer = typeof window === 'undefined';
    const store = configureStore({
        reducer: (rootState, action) => {
            let state = rootState;
            //  clear rtk caches
            if (clearCache.match(action)) {
                state = undefined;
            }
            return rootReducer(state, action);
        },
        middleware,
        devTools: process.env.NODE_ENV === 'development'
    }); // Creating the store again

    if (isServer) {
        return store;
    } else {
        // @ts-ignore
        store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

        return store;
    }
};

export type AppStore = ReturnType<typeof useStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(useStore);

export default useStore;
