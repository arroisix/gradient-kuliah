import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BannerSliceState = {
    viewed_campaign_banners_slug: string[];
};

const bannerSlice = createSlice({
    name: 'campaign_banner',
    initialState: {
        viewed_campaign_banners_slug: []
    } as BannerSliceState,
    reducers: {
        addViewedCampaignBannerSlug: (state, action: PayloadAction<string>) => {
            state.viewed_campaign_banners_slug.push(action.payload);
        },
        removeAllViewedCampaignBannerSlugs: (state) => {
            state.viewed_campaign_banners_slug = [];
        }
    }
});

export const {
    addViewedCampaignBannerSlug,
    removeAllViewedCampaignBannerSlugs
} = bannerSlice.actions;

export default bannerSlice.reducer;
