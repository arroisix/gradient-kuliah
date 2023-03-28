import { useAuth } from 'authentication/contexts/AuthProvider';
import { useLearning } from 'courses/contexts/LearningProvider';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { posthog } from 'posthog-js';
import { FaFile, FaFilePdf, FaLock } from 'react-icons/fa';

const AstroNotesItem = ({
    astro,
    extraCallback
}: {
    astro: Chapter;
    extraCallback?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { id, notionId } = router.query;
    const { setModalAuthOpen, isAuthenticated } = useAuth();
    const { is_subscribed } = useLearning();
    return (
        <div key={astro.id} className="mb-4">
            <h2 className="mb-2 text-black">{astro.chapter_name}</h2>
            <div className="flex flex-col gap-2">
                {astro.subchapters.map((sub: SubChapter) => {
                    if (sub.notebook?.is_public || isAuthenticated) {
                        if (sub.notebook?.notion_id) {
                            return (
                                <button
                                    onClick={() => {
                                        posthog.capture(
                                            `Click Astronotes Link`,
                                            {
                                                Subchapter: sub.subchapter_name,
                                                Chapter: astro.chapter_name,
                                                URL: sub?.notebook?.notebook_url
                                            }
                                        );
                                        extraCallback && extraCallback();
                                    }}
                                    key={sub.id}
                                    className={`${
                                        notionId === sub.notebook.notion_id
                                            ? 'text-blue-400'
                                            : 'text-neutral-500 '
                                    } hover:underline cursor-pointer flex items-center gap-2 text-left`}>
                                    {sub?.notebook?.is_free ? (
                                        <></>
                                    ) : is_subscribed ? (
                                        <></>
                                    ) : (
                                        <FaLock />
                                    )}
                                    <Link
                                        href={`/kelas/${id}/astronotes/${sub.notebook?.notion_id}`}>
                                        {sub.subchapter_name}
                                    </Link>
                                </button>
                            );
                        }

                        return (
                            <a
                                onClick={() =>
                                    posthog.capture(`Click Astronotes Link`, {
                                        Subchapter: sub.subchapter_name,
                                        Chapter: astro.chapter_name,
                                        URL: sub?.notebook?.notebook_url
                                    })
                                }
                                className={`${
                                    notionId === sub?.notebook?.notion_id
                                        ? 'text-blue-400'
                                        : 'text-neutral-500 '
                                } hover:underline cursor-pointer flex items-center gap-2 text-left`}
                                key={sub.id}
                                href={sub?.notebook?.notebook_url}>
                                {sub?.notebook?.is_free ? (
                                    <FaFilePdf />
                                ) : is_subscribed ? (
                                    <FaFilePdf />
                                ) : (
                                    <FaLock />
                                )}
                                {sub.subchapter_name}
                            </a>
                        );
                    }

                    return (
                        <button
                            className={`${
                                notionId === sub?.notebook?.notion_id
                                    ? 'text-blue-400'
                                    : 'text-neutral-500 '
                            } hover:underline cursor-pointer flex items-center gap-2 text-left`}
                            key={sub.id}
                            onClick={() => {
                                posthog.capture(`Click Astronotes Link`, {
                                    Subchapter: sub.subchapter_name,
                                    Chapter: astro.chapter_name,
                                    URL: sub?.notebook?.notebook_url
                                });
                                setModalAuthOpen(1);
                            }}>
                            <FaFilePdf />
                            {sub.subchapter_name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AstroNotesItem;
