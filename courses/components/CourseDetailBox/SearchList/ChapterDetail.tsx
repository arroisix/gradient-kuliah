import Skeleton from 'commons/components/elements/Skeleton';
import React, { Dispatch, SetStateAction } from 'react';
import ListSubchapter from './ListSubchapter';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
// import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
// import { useSelector } from 'react-redux';
// import { useGetListCourseSubChapterQuery } from 'courses/redux/api/publicCourseApi';

const ChapterDetail = ({
    chapterDetail,
    setNavigation
}: {
    chapterDetail: CourseChapter;
    setNavigation: Dispatch<SetStateAction<'SUBCHAPTER' | 'SEARCH_LIST'>>;
}): JSX.Element => {
    // const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading } = useGetSubchapterQuery(
        { chapterId: chapterDetail.chapter_id },
        { skip: !chapterDetail.chapter_id }
    );
    // const publicSubchapters = useGetListCourseSubChapterQuery(
    //     chapterDetail.chapter_id,
    //     { skip: isAuthenticated || !chapterDetail.chapter_id }
    // );
    // const { data, isLoading } = isAuthenticated
    //     ? privateSubchapters
    //     : publicSubchapters;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <HiOutlineChevronDown
                    onClick={() => setNavigation('SEARCH_LIST')}
                    size={18}
                    className={`w-[18px] h-[18px] text-white rotate-90 cursor-pointer transition-all`}
                />
                <span className="inline-block text-sm font-extrabold">{`${chapterDetail.chapter_name} (${chapterDetail.subchapter_counts})`}</span>
            </div>
            {isLoading && <Skeleton className="h-[30px] !m-0" repeat={3} />}
            {!isLoading && (
                <div className="flex flex-col gap-[14px] pb-[18px]">
                    {data?.subchapters.map((item) => (
                        <ListSubchapter key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChapterDetail;
