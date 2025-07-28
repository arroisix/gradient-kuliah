import ContentCard from 'dashboard/components/ContentCard';
import React from 'react';

interface DownloadContentProps {
    videos: DownloadedVideo[];
}

const DownloadContent = ({ videos }: DownloadContentProps): JSX.Element => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
                return (
                    <ContentCard
                        key={video.id}
                        id={video.id}
                        title={video.title}
                        isMajorClass={true}
                        category="Video"
                        thumbnail={video.thumbnail}
                        href={`/kelas/${video.course_slug}/${video.video_slug}`}
                        courseName={video.course_name}
                        chapterName={video.chapter_title}
                    />
                );
            })}
        </div>
    );
};

export default DownloadContent;
