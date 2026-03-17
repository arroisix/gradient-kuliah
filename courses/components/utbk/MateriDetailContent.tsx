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
    const courseSlug =
        (router.query.id as string) ||
        (router.query.slug_subtest as string) ||
        '';
    const slug_chapter = (router.query.slug_chapter as string) || '';

    const { searchKeyword } = useSearchSubchapter();

    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery({ slug: courseSlug }, { skip: !courseSlug });

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
        <div className="space-y-4 mt-6 overflow-scroll no-scrollbar rounded-xl h-[calc(100vh-5em-176px-36px-16px-24px-16px)] lg:h-[calc(100vh-32px-36px-16px-136px-36px-16px-24px-24px)]">
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
