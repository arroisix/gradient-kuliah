import { useRouter } from 'next/router';
import { MdOutlineArticle, MdLock, MdChevronRight } from 'react-icons/md';
import { useAuth } from 'src/authentication/contexts/AuthProvider';

const NotebookSection = ({
    chapters,
    asThrowPage,
    setNotebookPicked,
    notebookPicked
}: {
    chapters: Chapter[];
    asThrowPage?: boolean;
    setNotebookPicked: (notebook: Notebook) => void;
    notebookPicked: Notebook;
}): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, setModalAuthOpen } = useAuth();
    return (
        <div className="h-[500px] overflow-y-auto">
            {chapters.map((chapter) => {
                return (
                    <div key={chapter.id}>
                        <div className="p-4">
                            <span className="font-bold">
                                {chapter.chapterName}
                            </span>
                        </div>
                        {chapter.subchapters.map((subchapter) => {
                            return (
                                <div
                                    key={subchapter.id}
                                    onClick={() => {
                                        if (isAuthenticated()) {
                                            if (asThrowPage) {
                                                router.push(
                                                    `/kelas/${id}/belajar?type=notebook&sub=${subchapter.id}`
                                                );
                                            } else {
                                                setNotebookPicked(
                                                    subchapter.notebook as Notebook
                                                );

                                                router.push(
                                                    `/kelas/${id}/belajar?type=notebook&sub=${subchapter.id}`,
                                                    undefined,
                                                    { shallow: true }
                                                );
                                            }
                                        } else {
                                            setModalAuthOpen(1);
                                        }
                                    }}
                                    aria-hidden
                                    className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                                        notebookPicked?.id ===
                                            subchapter.notebook?.id &&
                                        'bg-neutral-600'
                                    }`}>
                                    <div className="flex w-full items-center">
                                        <div className="w-1/5 flex justify-center">
                                            {subchapter.notebook?.isFree ? (
                                                <MdOutlineArticle className="mr-4 text-xl" />
                                            ) : (
                                                <MdLock className="mr-4 text-xl text-amber-400" />
                                            )}
                                        </div>
                                        <div className="w-4/5 flex justify-between">
                                            <span className="w-full">
                                                {subchapter.notebook?.title}
                                            </span>
                                            <MdChevronRight />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default NotebookSection;
