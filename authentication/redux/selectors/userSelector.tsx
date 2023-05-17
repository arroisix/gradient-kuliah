export const getCurrentUser = (state: RootState): User =>
    state.authentication.user?.user as User;
export const getToken = (state: RootState): string =>
    state.authentication.user.token as string;
export const getIsNewUser = (state: RootState): boolean =>
    state.authentication.user.is_new_user ||
    state.authentication.user.user?.phone_number === '';
export const getIsAuthenticated = (state: RootState): boolean =>
    state.authentication.user.token !== undefined &&
    state.authentication.user.token !== null;
