import React from 'react';
import PopularProducts from './PopularProducts';
import SimilarQuestion from 'komunitas/components/CommunityPost/SimilarQuestion';
import Skeleton from 'commons/components/elements/Skeleton';

type PopularDiscussionsProps = {
    isLoading?: boolean;
    discussions?: CommunityPost[];
};

const PopularDiscussions = ({
    isLoading,
    discussions
}: PopularDiscussionsProps): JSX.Element => {
    if (isLoading)
        return (
            <PopularProducts title="Diskusi Terpopuler">
                <Skeleton
                    className="h-28 carousel-item w-80"
                    isCustomSize
                    repeat={5}
                />
            </PopularProducts>
        );

    if (!discussions) return <></>;
    return (
        <PopularProducts title="Diskusi Terpopuler">
            {discussions?.map((discussion) => (
                <SimilarQuestion
                    key={discussion.id}
                    question={{
                        ...discussion,
                        preview_content: discussion.content
                    }}
                    className="carousel-item w-80"
                    eventName="Click Most Popular Community Post on Search Landing Page"
                    eventPayload={{
                        'Community Post Slug': discussion.slug
                    }}
                />
            ))}
        </PopularProducts>
    );
};

export default PopularDiscussions;
