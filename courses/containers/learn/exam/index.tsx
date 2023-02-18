import Button from 'commons/components/elements/Button';
import MarkedTextContent from 'commons/components/elements/MarkedTextContent';
import Spinner from 'commons/components/elements/Spinner';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import AnswerChoice from 'courses/components/LearningExperience/ExamExercise/AnswerChoice';
import ExamQuestionNumber from 'courses/components/LearningExperience/ExamExercise/ExamQuestionNumber';
import QuestionTile from 'courses/components/LearningExperience/ExamExercise/QuestionTile';
import { useExam } from 'courses/contexts/ExamProvider';
import { useRouter } from 'next/router';
import { MdClose } from 'react-icons/md';

const ExamLearnContainer = (): JSX.Element => {
    const {
        problemQuestion,
        answers,
        submitAnswer,
        questionSequences,
        isCurrentAnswerSameWithSavedAnswer,
        isLoadingAnswer,
        finishExam,
        expandTiles,
        setExpandTiles,
        isCurrentQuestionLastQuestion
    } = useExam();
    const { isDesktopBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const { id } = router.query;

    const submitUserAnswer = async (): Promise<void> => {
        await submitAnswer();

        if (isCurrentQuestionLastQuestion()) {
            finishExam();
        }
    };

    const exitSafely = async (): Promise<void> => {
        await submitAnswer();

        router.push(`/kelas/${id as string}`);
    };

    return (
        <section className="flex flex-col md:flex-row relative overflow-hidden md:h-[100vh]">
            <div
                className={`w-full flex-col ${
                    expandTiles ? 'hidden md:relative md:flex' : 'relative flex'
                }`}>
                <header className="absoulte top-0 left-0 w-full z-2">
                    <div className="w-full px-4 md:px-8 py-4 flex justify-between">
                        <Button
                            variant="custom"
                            className="text-red-500 !p-0"
                            onClick={exitSafely}>
                            {isDesktopBreakpoints ? 'Keluar Latihan' : 'Keluar'}
                        </Button>
                        {!expandTiles && (
                            <div>
                                <ExamQuestionNumber />
                            </div>
                        )}
                    </div>
                </header>
                <div className="w-full p-4 md:px-32  md:pt-16 xl:pt-32 overflow-y-auto overflow-x-hidden h-[100vh]">
                    {problemQuestion && (
                        <MarkedTextContent
                            content={problemQuestion?.question}
                        />
                    )}
                    {problemQuestion && (
                        <div className="w-full flex flex-col gap-4 my-4">
                            {problemQuestion.answers.map(
                                (answer: ExamAnswer, index: number) => (
                                    <AnswerChoice
                                        {...answer}
                                        index={index}
                                        key={answer.id}
                                    />
                                )
                            )}
                        </div>
                    )}
                    {answers.length > 0 &&
                        !isCurrentAnswerSameWithSavedAnswer() && (
                            <div className="w-full flex justify-center items-center mt-8">
                                <Button
                                    variant="primary"
                                    className="w-[400px]"
                                    onClick={submitUserAnswer}>
                                    {isLoadingAnswer ? (
                                        <Spinner size="small" />
                                    ) : isCurrentQuestionLastQuestion() ? (
                                        'Simpan Jawaban dan Selesaikan Latihan'
                                    ) : (
                                        'Simpan Jawaban'
                                    )}
                                </Button>
                            </div>
                        )}
                </div>
            </div>
            {expandTiles && (
                <div
                    className={`transition-all ${
                        expandTiles
                            ? 'w-screen md:w-1/3 min-w-[350px] relative opacity-100'
                            : 'w-0 hidden opacity-0'
                    } h-[100vh] bg-[#1D1D1D] p-4 flex flex-col gap-4 items-center`}>
                    <h1 className="text-2xl font-bold text-center">
                        Daftar Soal
                    </h1>
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
                    <div className="w-full items-center justify-center">
                        <Button
                            variant="custom"
                            onClick={finishExam}
                            className="w-full text-red-500 border border-red-500">
                            Selesaikan Latihan
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ExamLearnContainer;
