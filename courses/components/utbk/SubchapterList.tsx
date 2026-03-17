import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import { SubchapterMenuItem } from '../SubchapterMenuItem';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { Dispatch, SetStateAction } from 'react';

interface SubchapterListProps {
    chapter_slug: string;
    chapter_id?: string;
    subchapterSearch?: SubchapterSearch['items'];
    setIsModalSheetOpen?: Dispatch<SetStateAction<boolean>>;
}

function SubchapterList({
    chapter_slug,
    chapter_id,
    subchapterSearch,
    setIsModalSheetOpen
}: SubchapterListProps): JSX.Element {
    const router = useRouter();
    const courseSlug =
        (router.query.id as string) ||
        (router.query.slug_subtest as string) ||
        '';
    const currentSubchapterSlug =
        (router.query.slug as string) ||
        (router.query.slug_subchapter as string) ||
        '';
    const isKelasRoute = router.pathname.startsWith('/kelas/');

    const { is_subscribed, subscribedFeatures } =
        useCourseSubscription(courseSlug);

    const { data, isLoading } = useGetSubchapterQuery(
        { chapterId: chapter_id ?? '' },
        { skip: !chapter_id }
    );

    const subchapters = subchapterSearch ?? data?.subchapters;

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-2 mt-2 px-4 pb-4">
                <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
            </div>
        );
    }

    if ((subchapters?.length ?? 0) === 0) {
        return (
            <div className="mt-2 px-4 pb-4">
                <p className="text-graphite-600 text-sm text-center">
                    Sabar ya, materi ini akan segera hadir untukmu.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 mt-2 px-4 pb-4">
            {subchapters?.map((value) => (
                <SubchapterMenuItem
                    key={value.id}
                    href={
                        isKelasRoute
                            ? `/kelas/${courseSlug}/${value.subchapter_slug}`
                            : `/utbk/materi/${courseSlug}/${chapter_slug}/${value.subchapter_slug}`
                    }
                    name={value.subchapter_name}
                    duration={value.duration}
                    type={value.type_name ?? value.type}
                    isActive={currentSubchapterSlug === value.subchapter_slug}
                    isFinished={
                        value.is_finished ?? value.status === 'COMPLETED'
                    }
                    setIsModalSheetOpen={setIsModalSheetOpen}
                    isDisabled={
                        (!is_subscribed && !value.is_free) ||
                        (is_subscribed &&
                            !value.is_free &&
                            !subscribedFeatures?.includes('material'))
                    }
                />
            ))}
        </div>
    );
}

export { SubchapterList };
