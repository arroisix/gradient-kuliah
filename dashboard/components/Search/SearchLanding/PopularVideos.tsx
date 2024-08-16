import React from 'react';
import PopularProducts from './PopularProducts';
import ProductCard from 'commons/components/elements/ProductCard';
import Skeleton from 'commons/components/elements/Skeleton';

type PopularVideosProps = {
    isLoading?: boolean;
    popularVideos?: (Omit<VideoRecommendation, 'title'> & {
        subchapter_name: string;
    })[];
};

const PopularVideos = ({
    isLoading,
    popularVideos
}: PopularVideosProps): JSX.Element => {
    if (isLoading)
        return (
            <PopularProducts title="Video Kelas Terpopuler">
                <Skeleton className="w-80 h-52" isCustomSize repeat={5} />
            </PopularProducts>
        );
    if (!popularVideos) return <></>;
    return (
        <PopularProducts title="Video Kelas Terpopuler">
            {popularVideos?.map((video) => (
                <ProductCard
                    key={video.id}
                    href={`/kelas/${video.course_slug}/${video.subchapter_slug}`}
                    orientation="vertical"
                    category="video"
                    product={{
                        title: video.subchapter_name,
                        thumbnail: video.thumbnail,
                        courseName: video.course_name,
                        inProgress: false,
                        latestProgress: 0
                    }}
                    className="carousel-item w-80"
                    eventName="Click Popular Video Card"
                />
            ))}
        </PopularProducts>
    );
};

export default PopularVideos;
