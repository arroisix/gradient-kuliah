import dynamic from 'next/dynamic';

import { useLearning } from 'courses/contexts/LearningProvider';
import {
    useListPostAnswerQuery,
    useListPostQuestionQuery
} from 'courses/redux/api/learningExperienceApi';
import moment from 'moment';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useState } from 'react';
import AnswerTextArea from './AnswerTextArea';
import { generateInitial } from 'commons/utils';

const TextContent = dynamic(import('./TextContent'), {
    ssr: false
});

const AnswerItem = ({ answer }: { answer: QnaAnswer }): JSX.Element => {
    return (
        <div className="flex gap-2 w-full">
            <div>
                <div className="h-[45px] w-[45px] bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center">
                    <span className="font-bold md:text-xl">
                        {generateInitial(answer.author.full_name)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex w-full gap-2 md:gap-8">
                    <p className="font-body font-bold text-xs md:text-base">
                        {answer.author.full_name}
                    </p>
                    <p className="font-body text-neutral-600 font-light text-xs md:text-base">
                        {moment(answer.created_at)
                            .utc()
                            .format('D MMM YYYY [-] hh:mm [WIB]')}
                    </p>
                </div>
                <TextContent content={answer.content} />
            </div>
        </div>
    );
};

const QuestionItem = ({ question }: { question: QnaQuestion }): JSX.Element => {
    const [showTextArea, setShowTextArea] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const { data: qnaAnswers } = useListPostAnswerQuery({
        question_id: question.id
    });

    return (
        <div className="flex gap-2 w-full">
            <div>
                <div className="h-[60px] w-[60px] bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center">
                    <span className="font-bold md:text-xl">
                        {generateInitial(question.author.full_name)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex w-full gap-2 md:gap-8">
                    <p className="font-body font-bold text-xs md:text-base">
                        {question.author.full_name}
                    </p>
                    <p className="font-body text-neutral-600 font-light text-xs md:text-base">
                        {moment(question.created_at)
                            .utc()
                            .format('D MMM YYYY [-] hh:mm [WIB]')}
                    </p>
                </div>
                <TextContent content={question.content} />
                <div className="flex gap-2 items-center mt-2">
                    {question.answer_count > 0 && (
                        <div
                            className="flex gap-1 items-center text-accent-blue cursor-pointer"
                            onClick={() => setShowAnswer(!showAnswer)}
                            aria-hidden>
                            <MdChatBubbleOutline />
                            <span className="text-sm font-body">
                                {question.answer_count} Jawaban
                            </span>
                        </div>
                    )}
                    <span
                        className="text-sm font-bold font-body cursor-pointer"
                        aria-hidden
                        onClick={() => {
                            if (showTextArea) {
                                setShowTextArea(false);
                            } else {
                                setShowTextArea(true);
                                setShowAnswer(true);
                            }
                        }}>
                        Balas
                    </span>
                </div>
                {showAnswer && (
                    <div className="flex flex-col gap-3 my-4">
                        {qnaAnswers?.data.map((answer: QnaAnswer) => (
                            <AnswerItem answer={answer} key={answer.id} />
                        ))}
                    </div>
                )}
                {showTextArea && (
                    <div className="my-4">
                        <AnswerTextArea
                            questionId={question.id}
                            onCancel={() => setShowTextArea(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ListQuestion = (): JSX.Element => {
    const { video } = useLearning();
    const { data } = useListPostQuestionQuery(
        {
            video_id: video.id
        },
        { skip: !video }
    );

    return (
        <div className="w-full flex flex-col gap-4 my-8">
            {data?.data.map((question: QnaQuestion) => (
                <QuestionItem question={question} key={question.id} />
            ))}
        </div>
    );
};

export default ListQuestion;
