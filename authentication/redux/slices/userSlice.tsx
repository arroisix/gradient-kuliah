import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'authentication/redux/api/authApi';
import { toast } from 'react-toastify';
import Router from 'next/router';

type UserSliceState = {
    user: User;
    token: string | null;
    is_profile_complete: boolean;
    photo_profile: string | null;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {} as User,
        token: null,
        is_profile_complete: true,
        photo_profile: null
    } as UserSliceState,
    reducers: {
        removeUser: () => {
            window.localStorage.removeItem('token');
            return {
                token: null,
                user: {} as User,
                is_profile_complete: true,
                photo_profile: null
            };
        },
        setNewUserFlag: (
            state: UserSliceState,
            { payload }: PayloadAction<boolean>
        ) => {
            return { ...state, is_profile_complete: payload };
        },
        clearCache: (state: UserSliceState) => {
            return state;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }: PayloadAction<LoginResponseData>) => {
                state.user = payload.user;
                state.token = payload.token;
                state.is_profile_complete = payload.is_profile_complete;

                window.localStorage.setItem('token', payload.token);

                toast.success(`Selamat datang, ${state.user.full_name}`, {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                });

                return state;
            }
        );
        builder.addMatcher(
            authApi.endpoints.socialLogin.matchFulfilled,
            (state, { payload }: PayloadAction<LoginResponseData>) => {
                state.user = payload.user;
                state.token = payload.token;
                state.is_profile_complete = payload.is_profile_complete;

                window.localStorage.setItem('token', payload.token);

                toast.success(`Selamat datang, ${state.user.full_name}`, {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                });

                return state;
            }
        );
        builder.addMatcher(
            authApi.endpoints.register.matchFulfilled,
            (state, { payload }: PayloadAction<LoginResponseData>) => {
                state.user = payload.user;
                state.token = payload.token;
                state.is_profile_complete = false;

                window.localStorage.setItem('token', payload.token);

                toast.success(`Selamat datang, ${state.user.full_name}`, {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                });

                return state;
            }
        );
        builder.addMatcher(
            authApi.endpoints.updateUser.matchFulfilled,
            (state, { payload }: PayloadAction<UpdateUserResponseData>) => {
                const { user_id: id, is_profile_complete } = payload;

                state.user = { id, ...payload };
                state.is_profile_complete = is_profile_complete as boolean;

                return state;
            }
        );
        builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
            window.localStorage.removeItem('token');

            Router.push('/');

            toast.success('Logout berhasil', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });

            state.token = null;
            state.user = {} as User;
            state.is_profile_complete = true;
            state.photo_profile = null;

            return state;
        });
    }
});

export const { removeUser, clearCache } = userSlice.actions;

export default userSlice.reducer;
