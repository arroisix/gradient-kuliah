import LearnLayout from 'commons/learnLayout';
import SearchResults from 'dashboard/containers/searchResults';
import React from 'react';

const SearchResultsPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <SearchResults />
        </LearnLayout>
    );
};

SearchResultsPage.displayName = 'Search Results';
export default SearchResultsPage;
