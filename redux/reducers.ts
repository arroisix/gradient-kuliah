import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from 'authentication/redux/reducers';
import { baseApi } from './api/baseApi';
import dashboardReducer from 'dashboard/redux/reducers';

const rootReducer = combineReducers({
    api: baseApi.reducer,
    authentication: authenticationReducer,
    dashboard: dashboardReducer
});

declare global {
    type RootState = ReturnType<typeof rootReducer>;
}

export default rootReducer;
