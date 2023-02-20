import Button from 'commons/components/elements/Button';
import { useExam } from 'courses/contexts/ExamProvider';
import { MdClose } from 'react-icons/md';
import ExamQuestionNumber from './ExamQuestionNumber';
import QuestionTile from './QuestionTile';

const ListQuestionTile = (): JSX.Element => {
    const {
        expandTiles,
        setExpandTiles,
        questionSequences,
        finishExam,
        isExamFinished
    } = useExam();

    return (
        <div
            className={`transition-all ${
                expandTiles
                    ? 'w-screen md:w-1/3 min-w-[350px] relative opacity-100'
                    : 'w-0 hidden opacity-0'
            } h-[100vh] bg-[#1D1D1D] p-4 flex flex-col gap-4 items-center`}>
            <h1 className="text-2xl font-bold text-center">Daftar Soal</h1>
            <MdClose
                onClick={() => setExpandTiles(false)}
                className="absolute top-4 right-4 text-3xl cursor-pointer"
            />
            <ExamQuestionNumber />
            <div className="grid grid-cols-3 gap-6 h-[75vh]">
                {questionSequences.map((question: string) => (
                    <QuestionTile question={question} key={question} />
                ))}
            </div>
            {!isExamFinished && (
                <div className="w-full items-center justify-center">
                    <Button
                        variant="custom"
                        onClick={finishExam}
                        className="w-full text-red-500 border border-red-500">
                        Selesaikan Latihan
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ListQuestionTile;
