import { baseApi } from 'redux/api/baseApi';

const SEARCH_BASE_URL = 'searches/';

export const searchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        search: builder.query<
            SearchResults<SearchDocument>,
            AdvancedSearchParams
        >({
            query: (params) => ({
                url: `${SEARCH_BASE_URL}public/queries/`,
                params
            })
        }),
        getAutocomplete: builder.query<
            AutocompleteResult<AutocompleteDocument>,
            { q: string }
        >({
            query: (params) => ({
                url: `${SEARCH_BASE_URL}public/queries/suggestion/`,
                params
            })
        }),
        getPopularSearches: builder.query<
            ListResponseData<{ id: string; query: string }>,
            BaseListQueryParams
        >({
            query: (params) => ({
                url: `${SEARCH_BASE_URL}public/queries/popular/`,
                params
            })
        })
    }),
    overrideExisting: false
});

export const { useSearchQuery, useGetAutocompleteQuery } = searchApi;

export const { getPopularSearches, search } = searchApi.endpoints;
