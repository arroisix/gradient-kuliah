import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'authentication/redux/api/authApi';
import { toast } from 'react-toastify';

type UserSliceState = {
    user: User;
    token: string | null;
    is_new_user: boolean;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {} as User,
        token: null,
        is_new_user: false
    } as UserSliceState,
    reducers: {
        removeUser: () => {
            window.localStorage.removeItem('token');
            return { token: null, user: {} as User, is_new_user: false };
        },
        setNewUserFlag: (
            state: UserSliceState,
            { payload }: PayloadAction<boolean>
        ) => {
            return { ...state, is_new_user: payload };
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
                state.is_new_user = payload.is_new_user ?? false;

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
                state.is_new_user = true;

                window.localStorage.setItem('token', payload.token);

                toast.success(`Selamat datang, ${state.user.full_name}`, {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                });

                return state;
            }
        );
    }
});

export const { removeUser, clearCache } = userSlice.actions;

export default userSlice.reducer;
