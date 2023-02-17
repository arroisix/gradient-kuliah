import { useExam } from 'courses/contexts/ExamProvider';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const ExamQuestionNumber = (): JSX.Element => {
    const {
        questionSequences,
        getCurrentQuestionNumber,
        getNextQuestion,
        getPrevQuestion,
        setExpandTiles
    } = useExam();
    return (
        <div className="w-full flex items-center justify-center gap-2">
            <button
                className="rounded-full p-2 bg-neutral-800 cursor-pointer hover:bg-neutral-600"
                onClick={getPrevQuestion}>
                <MdChevronLeft className="text-2xl" />
            </button>
            <button
                className="rounded-3xl py-1 px-4 bg-neutral-800"
                onClick={() => setExpandTiles(true)}>
                <p className="font-bold text-2xl">
                    {getCurrentQuestionNumber()} / {questionSequences.length}
                </p>
            </button>
            <button
                className="rounded-full p-2 bg-neutral-800 cursor-pointer hover:bg-neutral-600"
                onClick={getNextQuestion}>
                <MdChevronRight className="text-2xl" />
            </button>
        </div>
    );
};

export default ExamQuestionNumber;
