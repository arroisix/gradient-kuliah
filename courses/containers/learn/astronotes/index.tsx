import AstroNotesItem from 'courses/components/LearningExperience/AstroNotes/AstroNotesItem';
import usePublicCourseNotebook from 'courses/hooks/usePublicCourseNotebook';
import { getAllNotebookChapter } from 'courses/utils';
import { useRouter } from 'next/router';

const NotebookIndex = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data, loading } = usePublicCourseNotebook(id as string);
    const notebook = getAllNotebookChapter(data?.chapters as Chapter[]);

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
            return <span>AstroNotes belum tersedia :(</span>;
        }

        return (
            <>
                {notebook?.map((astro: Chapter) => (
                    <AstroNotesItem astro={astro} key={astro.id} />
                ))}
            </>
        );
    };

    return (
        <section className="pt-[65px] min-h-[100vh] flex flex-col md:flex-row relative md:overflow-x-hidden overflow-y-auto md:h-[100vh] bg-white text-black">
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
                <div className="flex flex-col gap-4 pb-32">
                    {renderNotebook()}
                </div>
            </div>
        </section>
    );
};

export default NotebookIndex;
