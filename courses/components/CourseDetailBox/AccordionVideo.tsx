import Skeleton from 'commons/components/elements/Skeleton';
import React from 'react';
import Collapse from './Collapse';

const AccordionVideo = ({
    chapters,
    isLoading
}: {
    chapters: CourseChapter[];
    isLoading: boolean;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-3 lg:pb-[18px]">
            {isLoading && <Skeleton className="h-[40px] !m-0" repeat={3} />}
            {chapters?.map(
                ({
                    chapter_id,
                    chapter_name,
                    is_finished,
                    subchapter_counts
                }) => (
                    <Collapse
                        key={chapter_id}
                        title={`${chapter_name} (${subchapter_counts})`}
                        chapter_id={chapter_id}
                        is_finished={is_finished ?? false}
                    />
                )
            )}
        </div>
    );
};

export default AccordionVideo;
