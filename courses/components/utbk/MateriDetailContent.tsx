import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import { SearchContent } from './SearchContent.tsx';
import { useRouter } from 'next/router.js';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import { ChapterAccordion } from './ChapterAccordion';

function MateriDetailContent(): JSX.Element {
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
        <div className="space-y-4 mt-6">
            {courseContent?.chapters?.map(
                ({
                    chapter_id,
                    chapter_name,
                    subchapter_counts,
                    is_finished
                }) => (
                    <ChapterAccordion
                        key={chapter_id}
                        title={`${chapter_name} (${subchapter_counts})`}
                        chapter_id={chapter_id}
                        is_finished={is_finished ?? false}
                        chapter_slug={''} // TODO
                        initialOpen={slug_chapter === ''} // TODO
                    />
                )
            )}
        </div>
    );
}

export { MateriDetailContent };
