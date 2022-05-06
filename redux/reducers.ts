import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from 'authentication/redux/reducers';
import { baseApi } from './api/baseApi';

const rootReducer = combineReducers({
    api: baseApi.reducer,
    authentication: authenticationReducer
});

declare global {
    type RootState = ReturnType<typeof rootReducer>;
}

export default rootReducer;
