import { useGetPopularBooksQuery } from 'courses/redux/api/astronotesApi';
import { useGetPopularVideosQuery } from 'courses/redux/api/courseApi';
import PopularBook from 'dashboard/components/Search/SearchLanding/PopularBook';
import PopularDiscussions from 'dashboard/components/Search/SearchLanding/PopularDiscussions';
import PopularProblems from 'dashboard/components/Search/SearchLanding/PopularProblems';
import PopularSearches from 'dashboard/components/Search/SearchLanding/PopularSearches';
import PopularVideos from 'dashboard/components/Search/SearchLanding/PopularVideos';
import { useGetPublicCommunityPostQuery } from 'komunitas/redux/api/komunitasApi';
import React from 'react';

export type SearchLandingProps = {
    isHydrate?: boolean;
    popularSearches?: ListResponseData<{
        id: string;
        query: string;
    }>;
    popularVideos?: ListResponseData<
        Omit<VideoRecommendation, 'title'> & { subchapter_name: string }
    >;
    popularAstronotes?: ListResponseData<PopularBook>;
    popularTextbook?: ListResponseData<PopularBook>;
    popularBankSoal?: ListResponseData<PopularBook>;
    popularDiscussions?: CommunityPostResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
};

const SearchLanding = ({
    isHydrate,
    popularSearches,
    popularVideos,
    popularAstronotes,
    popularTextbook,
    popularBankSoal,
    popularDiscussions
}: SearchLandingProps): JSX.Element => {
    const { data: videos, isLoading: isLoadingVideos } =
        useGetPopularVideosQuery({ sort: 'popular' }, { skip: !isHydrate });
    const { data: astronotes, isLoading: isLoadingAstronotes } =
        useGetPopularBooksQuery({ type: 'astronotes' }, { skip: !isHydrate });
    const { data: textbook, isLoading: isLoadingTextbook } =
        useGetPopularBooksQuery({ type: 'text-book' }, { skip: !isHydrate });
    const { data: bankSoal, isLoading: isLoadingBankSoal } =
        useGetPopularBooksQuery({ type: 'bank-soal' }, { skip: !isHydrate });
    const { data: discussion, isLoading: isLoadingDiscussion } =
        useGetPublicCommunityPostQuery(
            { sort_by: 'POPULAR' },
            { skip: !isHydrate }
        );

    return (
        <div className="space-y-8">
            <PopularSearches popularSearches={popularSearches?.data} />
            <PopularVideos
                isLoading={isLoadingVideos}
                popularVideos={videos?.data ?? popularVideos?.data}
            />
            <PopularBook
                isLoading={isLoadingAstronotes}
                books={astronotes?.data ?? popularAstronotes?.data}
            />
            <PopularProblems
                title="Textbook Terpopuler"
                isLoading={isLoadingTextbook}
                problems={textbook?.data ?? popularTextbook?.data}
            />
            <PopularProblems
                title="Bank Soal Terpopuler"
                isLoading={isLoadingBankSoal}
                problems={bankSoal?.data ?? popularBankSoal?.data}
            />
            <PopularDiscussions
                isLoading={isLoadingDiscussion}
                discussions={
                    discussion?.community_posts ??
                    popularDiscussions?.community_posts
                }
            />
        </div>
    );
};

export default SearchLanding;
