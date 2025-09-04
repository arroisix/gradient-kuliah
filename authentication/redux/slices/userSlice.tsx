import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'authentication/redux/api/authApi';
import { toast } from 'react-toastify';

type UserSliceState = {
    user: User;
    token: string | null;
    refresh_token: string | null;
    is_profile_complete: boolean;
    photo_profile: string | null;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {} as User,
        token: null,
        refresh_token: null,
        is_profile_complete: true,
        photo_profile: null
    } as UserSliceState,
    reducers: {
        removeUser: () => {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('refresh_token');
            return {
                token: null,
                refresh_token: null,
                user: {} as User,
                is_profile_complete: true,
                photo_profile: null
            };
        },
        updateToken: (state: UserSliceState, { payload }: PayloadAction<string>) => {
            state.token = payload;
            window.localStorage.setItem('token', payload);
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
                state.token = payload.access_token;
                state.refresh_token = payload.refresh_token;
                state.is_profile_complete = payload.is_profile_complete;

                window.localStorage.setItem('token', payload.access_token);
                window.localStorage.setItem('refresh_token', payload.refresh_token);

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
                state.token = payload.access_token;
                state.refresh_token = payload.refresh_token;
                state.is_profile_complete = payload.is_profile_complete;

                window.localStorage.setItem('token', payload.access_token);
                window.localStorage.setItem('refresh_token', payload.refresh_token);

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
                state.token = payload.access_token;
                state.refresh_token = payload.refresh_token;
                state.is_profile_complete = false;

                window.localStorage.setItem('token', payload.access_token);
                window.localStorage.setItem('refresh_token', payload.refresh_token);

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
            window.localStorage.removeItem('refresh_token');

            toast.success('Logout berhasil', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });

            state.token = null;
            state.refresh_token = null;
            state.user = {} as User;
            state.is_profile_complete = true;
            state.photo_profile = null;

            return state;
        });
    }
});

export const { removeUser, clearCache, updateToken } = userSlice.actions;

export default userSlice.reducer;