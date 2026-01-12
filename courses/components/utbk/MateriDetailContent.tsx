import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import { useRouter } from 'next/router.js';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import { ChapterAccordion } from './ChapterAccordion';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction } from 'react';

const SearchContent = dynamic(() => import('./SearchContent.tsx'));

interface MateriDetailContentProps {
    setIsModalSheetOpen?: Dispatch<SetStateAction<boolean>>;
}

function MateriDetailContent({
    setIsModalSheetOpen
}: MateriDetailContentProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest, slug_chapter } = router.query as {
        slug_subtest: string;
        slug_chapter: string;
    };

    const { searchKeyword } = useSearchSubchapter();

    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery(
            { slug: slug_subtest },
            { skip: !slug_subtest }
        );

    if (isLoadingCourse) {
        return (
            <div className="animate-pulse space-y-4 mt-6">
                <div className="bg-[#333333] h-12 w-full rounded-lg"></div>
                <div className="bg-[#333333] h-12 w-full rounded-lg"></div>
                <div className="bg-[#333333] h-12 w-full rounded-lg"></div>
            </div>
        );
    }

    // show search results
    if (searchKeyword !== '') {
        return <SearchContent />;
    }

    return (
        <div className="space-y-4 mt-6 h-[calc(100vh-32px-36px-16px-136px-36px-16px-24px-24px)] overflow-scroll rounded-xl">
            {courseContent?.chapters?.map((chapter) => (
                <ChapterAccordion
                    key={chapter.chapter_id}
                    title={`${chapter.chapter_name} (${chapter.subchapter_counts})`}
                    chapter_id={chapter.chapter_id}
                    chapter_slug={chapter.chapter_slug}
                    initialOpen={slug_chapter === chapter.chapter_slug}
                    setIsModalSheetOpen={setIsModalSheetOpen}
                />
            ))}
        </div>
    );
}

export { MateriDetailContent };
