import { useRouter } from 'next/router';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import { SubchapterMenuItem } from '../SubchapterMenuItem';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

interface SubchapterListProps {
    chapter_id: string;
    chapter_slug: string;
}

function SubchapterList({
    chapter_id,
    chapter_slug
}: SubchapterListProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest, slug_subchapter } = router.query as {
        slug_subtest: string;
        slug_subchapter: string;
    };

    const { is_subscribed } = useCourseSubscription();
    const { data, isLoading } = useGetSubchapterQuery({
        chapterId: chapter_id
    });

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-2 mt-6">
                <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
            </div>
        );
    }

    if ((data?.subchapters.length ?? 0) === 0) {
        return (
            <div className="mt-6">
                <p className="text-graphite-600 text-sm text-center">
                    Sabar ya, materi ini akan segera hadir untukmu.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 mt-6">
            {data?.subchapters?.map((value) => (
                <SubchapterMenuItem
                    key={value.id}
                    href={`/utbk/materi/${slug_subtest}/${chapter_slug}/${value.subchapter_slug}`}
                    name={value.subchapter_name}
                    duration={value.duration}
                    type={value.type}
                    isActive={slug_subchapter === value.subchapter_slug}
                    isFinished={value.is_finished}
                    isDisabled={!is_subscribed && !value.is_free}
                />
            ))}
        </div>
    );
}

export { SubchapterList };
