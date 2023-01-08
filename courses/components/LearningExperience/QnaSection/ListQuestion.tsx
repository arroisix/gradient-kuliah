import dynamic from 'next/dynamic';

import moment from 'moment';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import AnswerTextArea from './AnswerTextArea';
import { generateInitial } from 'commons/utils';
import Image from 'next/image';
import useQnaQuestionInfiniteScroll from 'courses/hooks/useQnaQuestionInfiniteScroll';
import useQnaAnswerInfiniteScroll from 'courses/hooks/useQnaAnswerInfiniteScroll';
import Button from 'commons/components/elements/Button';

const TextContent = dynamic(import('./TextContent'), {
    ssr: false
});

const AnswerItem = ({ answer }: { answer: QnaAnswer }): JSX.Element => {
    return (
        <div className="flex gap-2 w-full">
            <div>
                <div className="h-[45px] w-[45px] bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center">
                    <span className="font-bold md:text-xl">
                        {answer.is_anonymous
                            ? '?'
                            : generateInitial(answer.author.full_name)}
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
                <div className="flex gap-2 flex-wrap my-4">
                    {answer.attachment?.map((url: string) => (
                        <Image
                            key={url}
                            height={200}
                            width={200}
                            className="object-contain cursor-pointer"
                            src={url}
                            alt={url}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ListAnswerContainer = ({
    questionId
}: {
    questionId: string;
}): JSX.Element => {
    const { allData, anchor, hasMore, loadMore } =
        useQnaAnswerInfiniteScroll(questionId);
    return (
        <>
            <div className="flex flex-col gap-3 mt-4">
                {allData?.data.map((answer: QnaAnswer) => (
                    <AnswerItem answer={answer} key={answer.id} />
                ))}
            </div>
            <div ref={anchor} className="w-full h-0" />
            {hasMore && (
                <div className="w-full flex justify-center items-center">
                    <Button variant="custom" onClick={loadMore}>
                        Muat Lebih
                    </Button>
                </div>
            )}
        </>
    );
};

const QuestionItem = ({ question }: { question: QnaQuestion }): JSX.Element => {
    const [showTextArea, setShowTextArea] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const ref = useRef({} as HTMLDivElement);

    useEffect(() => {
        if (showTextArea) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [showTextArea]);

    return (
        <div className="flex gap-2 w-full">
            <div>
                <div className="h-[60px] w-[60px] bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center">
                    <span className="font-bold md:text-xl">
                        {question.is_anonymous
                            ? '?'
                            : generateInitial(question.author.full_name)}
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
                <div className="flex gap-2 flex-wrap my-4">
                    {question.attachment?.map((url: string) => (
                        <Image
                            key={url}
                            height={200}
                            width={200}
                            className="object-contain cursor-pointer"
                            src={url}
                            alt={url}
                        />
                    ))}
                </div>
                <div className="flex gap-2 items-center mt-2">
                    {question.answer_count > 0 && (
                        <div
                            className="flex gap-1 items-center text-accent-blue cursor-pointer"
                            onClick={() => {
                                setShowAnswer(!showAnswer);
                                setShowTextArea(!showTextArea);
                            }}
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
                {showAnswer && <ListAnswerContainer questionId={question.id} />}
                {showTextArea && (
                    <div className="my-4" ref={ref}>
                        <AnswerTextArea
                            key={`answer-area-${question.id}`}
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
    const { allData, anchor } = useQnaQuestionInfiniteScroll();

    return (
        <div className="w-full flex flex-col gap-4 my-8">
            {allData?.data.map((question: QnaQuestion) => (
                <QuestionItem question={question} key={question.id} />
            ))}
            <div ref={anchor} className="w-full h-0" />
        </div>
    );
};

export default ListQuestion;
