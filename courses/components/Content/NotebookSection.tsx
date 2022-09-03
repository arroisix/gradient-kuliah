import { useRouter } from 'next/router';
import { MdOutlineArticle, MdLock, MdChevronRight } from 'react-icons/md';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ComingSoonContent from './ComingSoonContent';

const NotebookSection = ({
    chapters,
    asThrowPage,
    setNotebookPicked,
    notebookPicked,
    isSubscribed
}: {
    chapters: Chapter[];
    asThrowPage?: boolean;
    setNotebookPicked: (notebook: Notebook) => void;
    notebookPicked: Notebook;
    isSubscribed: boolean;
}): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="h-[500px] overflow-y-auto">
            {chapters?.map((chapter) => {
                return (
                    <div key={chapter.id}>
                        <div className="p-4">
                            <span className="font-bold">
                                {chapter.chapter_name}
                            </span>
                        </div>
                        {chapter.subchapters.length > 0 ? (
                            chapter?.subchapters?.map((subchapter) => {
                                return (
                                    <div
                                        key={subchapter.id}
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                setNotebookPicked(
                                                    subchapter.notebook as Notebook
                                                );
                                                if (asThrowPage) {
                                                    router.push(
                                                        `/kelas/${id}/belajar/notebook/${chapter.id}/${subchapter.id}`,
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
                                                {subchapter.notebook?.is_free ||
                                                isSubscribed ? (
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
                            })
                        ) : (
                            <ComingSoonContent />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default NotebookSection;
