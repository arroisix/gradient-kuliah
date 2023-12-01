export const getCurrentUser = (state: RootState): User =>
    state.authentication.user?.user as User;
export const getToken = (state: RootState): string =>
    state.authentication.user.token as string;
export const getIsProfileComplete = (state: RootState): boolean =>
    state.authentication.user.is_profile_complete;
export const getIsAuthenticated = (state: RootState): boolean =>
    state.authentication.user.token !== undefined &&
    state.authentication.user.token !== null;
export const getCurrentDeviceTypeId = (state: RootState): number | null=>
    state.authentication.user.device_type_id;
export const getCurrentDeviceAllowed = (state: RootState): boolean | null =>
    state.authentication.user.device_allowed;
