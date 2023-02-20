import Button from 'commons/components/elements/Button';
import MarkedTextContent from 'commons/components/elements/MarkedTextContent';
import Spinner from 'commons/components/elements/Spinner';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import AnswerChoice from 'courses/components/LearningExperience/ExamExercise/AnswerChoice';
import ExamQuestionNumber from 'courses/components/LearningExperience/ExamExercise/ExamQuestionNumber';
import ListQuestionTile from 'courses/components/LearningExperience/ExamExercise/ListQuestionTile';
import { useExam } from 'courses/contexts/ExamProvider';
import { useRouter } from 'next/router';

const ExamLearnContainer = (): JSX.Element => {
    const {
        problemQuestion,
        answers,
        submitAnswer,
        isCurrentAnswerSameWithSavedAnswer,
        isLoadingAnswer,
        finishExam,
        expandTiles,
        isCurrentQuestionLastQuestion,
        isExamFinished
    } = useExam();
    const { isDesktopBreakpoints } = useWindowBreakpoints();
    const router = useRouter();
    const { id } = router.query;

    const submitUserAnswer = async (): Promise<void> => {
        await submitAnswer();

        if (isCurrentQuestionLastQuestion()) {
            await finishExam();
        }
    };

    const exitSafely = async (): Promise<void> => {
        await submitAnswer(true);

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
                <div className="w-full p-4 md:px-32  md:pt-16 xl:pt-32 overflow-y-auto overflow-x-hidden h-[100vh] flex flex-col gap-4">
                    {problemQuestion && (
                        <MarkedTextContent
                            content={problemQuestion?.question}
                        />
                    )}
                    <span className="font-thin text-neutral-300 font-body">
                        {problemQuestion?.type_name === 'multiple_answer'
                            ? 'Pilih semua jawaban yang paling tepat'
                            : 'Pilih satu jawaban yang paling tepat'}
                    </span>
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
                        !isCurrentAnswerSameWithSavedAnswer() &&
                        !isExamFinished && (
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
                    {problemQuestion?.solution && isExamFinished && (
                        <div className="pb-8">
                            <h3 className="text-lg font-bold font-body">
                                Pembahasan
                            </h3>
                            {problemQuestion?.solution && (
                                <MarkedTextContent
                                    content={problemQuestion?.solution}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            {expandTiles && <ListQuestionTile />}
        </section>
    );
};

export default ExamLearnContainer;
