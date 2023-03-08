import { useAuth } from 'authentication/contexts/AuthProvider';
import { useLearning } from 'courses/contexts/LearningProvider';
import usePublicCourseNotebook from 'courses/hooks/usePublicCourseNotebook';
import { getAllNotebookChapter } from 'courses/utils';
import { useRouter } from 'next/router';
import { posthog } from 'posthog-js';
import { FaFile, FaLock } from 'react-icons/fa';

const NotebookIndex = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data, loading } = usePublicCourseNotebook(id as string);
    const notebook = getAllNotebookChapter(data?.chapters as Chapter[]);
    const { setModalAuthOpen, isAuthenticated } = useAuth();
    const { is_subscribed } = useLearning();

    console.log(data);

    const renderNotebook = (): JSX.Element => {
        if (loading) {
            return (
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-2">
                        <div className="p-4 w-72 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="p-4 w-72 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="p-4 w-72 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                    </div>
                </div>
            );
        }

        if (!loading && notebook?.length === 0) {
            <span>AstroNotes belum tersedia :(</span>;
        }

        return (
            <>
                {notebook?.map((astro: Chapter) => (
                    <div key={astro.id}>
                        <h2 className="text-2xl font-bold mb-4">
                            {astro.chapter_name}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {astro.subchapters.map((sub: SubChapter) => {
                                if (
                                    sub.notebook?.is_public ||
                                    isAuthenticated
                                ) {
                                    return (
                                        <a
                                            onClick={() =>
                                                posthog.capture(
                                                    `Click Astronotes Link`,
                                                    {
                                                        Subchapter:
                                                            sub.subchapter_name,
                                                        Chapter:
                                                            astro.chapter_name,
                                                        URL: sub?.notebook
                                                            ?.notebook_url
                                                    }
                                                )
                                            }
                                            className="text-blue-400 hover:underline hover:text-blue-500 cursor-pointer flex items-center gap-2"
                                            key={sub.id}
                                            href={sub?.notebook?.notebook_url}>
                                            {sub?.notebook?.is_free ? (
                                                <FaFile />
                                            ) : is_subscribed ? (
                                                <FaFile />
                                            ) : (
                                                <FaLock />
                                            )}
                                            {sub.subchapter_name}
                                        </a>
                                    );
                                }

                                return (
                                    <button
                                        className="text-blue-400 hover:underline hover:text-blue-500 cursor-pointer flex items-center gap-2"
                                        key={sub.id}
                                        onClick={() => {
                                            posthog.capture(
                                                `Click Astronotes Link`,
                                                {
                                                    Subchapter:
                                                        sub.subchapter_name,
                                                    Chapter: astro.chapter_name,
                                                    URL: sub?.notebook
                                                        ?.notebook_url
                                                }
                                            );
                                            setModalAuthOpen(1);
                                        }}>
                                        <FaFile />
                                        {sub.subchapter_name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </>
        );
    };

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh]">
            <div className="md:px-32 md:py-8 p-4 w-full">
                <div className="flex flex-col gap-4 mb-4">
                    <h1 className="text-2xl md:text-4xl font-bold break-word flex gap-1 items-center">
                        AstroNotes:{' '}
                        {loading ? (
                            <div className="p-4 w-64 bg-neutral-600 animate-pulse rounded-lg" />
                        ) : (
                            data?.course_name
                        )}
                    </h1>
                    <h3 className="text-neutral-400">Oleh Gradient</h3>
                    <div className="w-full h-px bg-neutral-400" />
                </div>
                <div className="flex flex-col gap-4">{renderNotebook()}</div>
            </div>
        </section>
    );
};

export default NotebookIndex;
