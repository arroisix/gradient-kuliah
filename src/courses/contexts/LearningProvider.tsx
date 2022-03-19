import { useRouter } from 'next/router';
import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState
} from 'react';
import { getAllNotebookChapter, getAllVideoChapter } from '../utils';

interface LearningContextType {
    setVideoPicked: (video: Video) => void;
    videoPicked: Video;
    setNotebookPicked: (notebook: Notebook) => void;
    notebookPicked: Notebook;
    setSubchapterName: (name: string) => void;
    subchapterName: string;
}

const LearningContext = createContext<LearningContextType>(
    {} as LearningContextType
);

export function LearningProvider({
    children,
    course
}: {
    children: ReactNode;
    course: Course;
}): JSX.Element {
    const router = useRouter();
    const { type, sub, chapter } = router.query;
    const videoCourse = getAllVideoChapter(course?.chapters);
    const notebookCourse = getAllNotebookChapter(course?.chapters);

    const [subchapterName, setSubchapterName] = useState(
        videoCourse[0]?.subchapters[0]?.subchapterName
    );
    const [videoPicked, setVideoPicked] = useState<Video>(
        type === 'video'
            ? (videoCourse
                  .filter((c) => c.id === chapter)[0]
                  ?.subchapters.filter((s) => s.id === sub)[0]?.video as Video)
            : (videoCourse[0]?.subchapters[0]?.video as Video)
    );
    const [notebookPicked, setNotebookPicked] = useState(
        type === 'notebook'
            ? (notebookCourse
                  .filter((c) => c.id === chapter)[0]
                  ?.subchapters.filter((s) => s.id === sub)[0]
                  ?.notebook as Notebook)
            : (notebookCourse[0]?.subchapters[0]?.notebook as Notebook)
    );

    const memoedValue = useMemo(
        () => ({
            videoPicked,
            notebookPicked,
            subchapterName,
            setNotebookPicked,
            setVideoPicked,
            setSubchapterName
        }),
        [videoPicked, notebookPicked, subchapterName]
    );

    return (
        <LearningContext.Provider value={memoedValue}>
            {children}
        </LearningContext.Provider>
    );
}

export const useLearning = (): LearningContextType => {
    return useContext(LearningContext);
};

export default LearningContext;
