import { useAuth } from 'authentication/contexts/AuthProvider';
import { Layout } from 'commons/components/Layout';
import LearnLayout from 'commons/learnLayout';
import { cn } from 'commons/utils';
import SearchResults from 'dashboard/containers/searchResults';
import React from 'react';

const SearchResultsPage = (): JSX.Element => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <SearchResults />
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <SearchResults />
            </div>
        </Layout>
    );
};

SearchResultsPage.displayName = 'Search Results';
export default SearchResultsPage;
