import { combineReducers } from '@reduxjs/toolkit';
import bannerReducer from 'dashboard/redux/slices/bannerSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux/_sync_storage';

const dashboardPersistConfig = {
    key: 'dashboard',
    storage,
    whitelist: ['viewed_campaign_banners_slug']
};

const dashboardReducer = combineReducers({
    campaign_banner: persistReducer(dashboardPersistConfig, bannerReducer)
});

export default dashboardReducer;
