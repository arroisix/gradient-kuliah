import { combineReducers } from '@reduxjs/toolkit';
import userReducer from 'authentication/redux/slices/userSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux/_sync_storage';

const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['user', 'token', 'refresh_token', 'is_profile_complete']
};

const authenticationReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer)
});

export default authenticationReducer;
