import { useAuth } from 'authentication/contexts/AuthProvider';
import { useLearning } from 'courses/contexts/LearningProvider';
import usePublicCourseDetail from 'courses/hooks/usePublicCourseDetail';
import { getAllNotebookChapter } from 'courses/utils';
import { useRouter } from 'next/router';
import { FaFile, FaLock } from 'react-icons/fa';

const NotebookIndex = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data } = usePublicCourseDetail(id as string);
    const notebook = getAllNotebookChapter(data?.chapters as Chapter[]);
    const { setModalAuthOpen } = useAuth();
    const { is_subscribed } = useLearning();

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh]">
            <div className="md:px-32 md:py-8 p-4 w-full">
                <div className="flex flex-col gap-4 mb-4">
                    <h1 className="text-2xl md:text-4xl font-bold break-word">
                        AstroNotes: {data?.course_name}
                    </h1>
                    <h3 className="text-neutral-400">Oleh Gradient</h3>
                    <div className="w-full h-px bg-neutral-400" />
                </div>
                <div className="flex flex-col gap-4">
                    {notebook?.length === 0 && (
                        <span>AstroNotes belum tersedia :(</span>
                    )}
                    {notebook?.map((astro: Chapter) => (
                        <div key={astro.id}>
                            <h2 className="text-2xl font-bold mb-4">
                                {astro.chapter_name}
                            </h2>
                            <div className="flex flex-col gap-4">
                                {astro.subchapters.map((sub: SubChapter) => {
                                    if (sub.notebook?.is_public) {
                                        return (
                                            <a
                                                className="text-blue-400 hover:underline hover:text-blue-500 cursor-pointer flex items-center gap-2"
                                                key={sub.id}
                                                href={
                                                    sub?.notebook?.notebook_url
                                                }>
                                                {sub.notebook.is_free ? (
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
                                            onClick={() => setModalAuthOpen(1)}>
                                            <FaFile />
                                            {sub.subchapter_name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NotebookIndex;
