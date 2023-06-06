import { useRouter } from 'next/router';
import { MdOutlineArticle, MdLock, MdChevronRight } from 'react-icons/md';
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
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="h-full overflow-y-auto">
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
                                                        `/kelas/kalkulus1/belajar/notebook/${chapter.id}/${subchapter.id}`,
                                                        undefined,
                                                        { shallow: true }
                                                    );
                                                }
                                            } else {
                                                // TODO: Implement redirection for `/kelas/kalkulus1/belajar/notebook/${chapter.id}/${subchapter.id}`
                                                router.push('/masuk');
                                            }
                                        }}
                                        aria-hidden
                                        className={`w-full flex p-4 items-center hover:bg-neutral-600 cursor-pointer ${
                                            notebookPicked?.id ===
                                                subchapter.notebook?.id &&
                                            'bg-neutral-600'
                                        }`}>
                                        <div className="flex items-center w-full">
                                            <div className="flex justify-center w-1/5">
                                                {subchapter.notebook?.is_free ||
                                                isSubscribed ? (
                                                    <MdOutlineArticle className="mr-4 text-xl" />
                                                ) : (
                                                    <MdLock className="mr-4 text-xl text-amber-400" />
                                                )}
                                            </div>
                                            <div className="flex justify-between w-4/5">
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
