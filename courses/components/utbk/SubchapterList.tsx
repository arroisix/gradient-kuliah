import { useRouter } from 'next/router';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import { CircleIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { formatDuration } from 'commons/utils';
import { FaCircleCheck } from 'react-icons/fa6';

interface SubchapterListProps {
    chapter_id: string;
    chapter_slug: string;
    is_finished: boolean;
}

function SubchapterList({
    chapter_id,
    chapter_slug,
    is_finished
}: SubchapterListProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest, slug_subchapter } = router.query as {
        slug_subtest: string;
        slug_subchapter: string;
    };

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
                <Link
                    href={`/utbk/materi/${slug_subtest}/${chapter_slug}/${value.subchapter_slug}`}
                    key={value.subchapter_slug}
                    className={`${
                        slug_subchapter === value.subchapter_slug
                            ? 'bg-[#36236A]'
                            : 'bg-transparent'
                    } p-3 rounded-lg flex justify-between items-center gap-4`}>
                    <VideoIcon className="w-4 h-4 text-white shrink-0" />

                    <div className="w-full space-y-1">
                        <p
                            className={`${
                                slug_subchapter === value.subchapter_slug
                                    ? 'font-semibold'
                                    : 'font-normal'
                            } text-white text-sm w-full`}>
                            {value.subchapter_name}
                        </p>
                        <span className="text-[#DEDEDE] font-bold text-sm">
                            {formatDuration(value.duration)}
                        </span>
                    </div>

                    {is_finished ? (
                        <FaCircleCheck className="w-4 h-4 text-[#03AC5C] shrink-0" />
                    ) : (
                        <CircleIcon className="w-4 h-4 text-white shrink-0" />
                    )}
                </Link>
            ))}
        </div>
    );
}

export { SubchapterList };
