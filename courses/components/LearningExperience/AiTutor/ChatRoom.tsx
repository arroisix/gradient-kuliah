import Button from 'commons/components/elements/Button';
import { MdClose, MdThumbUpAlt } from 'react-icons/md';
import {
    useAskTutorMutation,
    useGetChatRoomQuery
} from 'courses/redux/api/aiTutorApi';

import { Formik } from 'formik';
import {
    Dispatch,
    MouseEventHandler,
    SetStateAction,
    useEffect,
    useRef
} from 'react';
import { useLearning } from 'courses/contexts/LearningProvider';
import Skeleton from 'commons/components/elements/Skeleton';
import CopilotFill from 'commons/components/elements/Icons/CopilotFill';
import { TbSend } from 'react-icons/tb';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import TextContent from './TextContent';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

interface ChatRoomProps {
    uniqueId: string;
    onClick: (event: boolean) => void | MouseEventHandler<HTMLDivElement>;
    setIsShowModal: Dispatch<SetStateAction<boolean>>;
    setFeedbackStatus: Dispatch<
        SetStateAction<{
            status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
            answer_id: string;
        }>
    >;
}

interface BubbleProps {
    message: AiTutorMessage;
}

export const processMessage = (message: string): JSX.Element[] => {
    const messagesClean = message.split('\n');

    return messagesClean.map((m: string) => <p key={m}>{m}</p>);
};

const StudentQuestionBubble = ({ message }: BubbleProps): JSX.Element => {
    return (
        <div className="px-4 py-[6px] bg-accent-purple rounded-lg !text-white">
            <TextContent
                content={message.message.message}
                className="text-white !font-body markdown-body-xs"
            />
        </div>
    );
};

const TutorAnswerBubble = ({
    message,
    setIsShowModal,
    setFeedbackStatus,
    answer_id
}: BubbleProps & {
    setIsShowModal: Dispatch<SetStateAction<boolean>>;
    setFeedbackStatus: Dispatch<
        SetStateAction<{
            status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
            answer_id: string;
        }>
    >;
    answer_id: string;
}): JSX.Element => {
    const renderTutorAnswer = (): string => {
        try {
            return JSON.parse(
                message.message.message
                    .replaceAll("'", '"')
                    .replaceAll('\n', '\\n')
            ).answer;
        } catch {
            return message.message.message;
        }
    };

    return (
        <div className="w-full flex gap-2">
            <div>
                <div className="bg-white p-[4px] rounded-full">
                    <CopilotFill width={20} height={18} />
                </div>
            </div>
            <span className="inline-block font-body text-xs text-black bg-white px-4 py-[6px] rounded-lg">
                <TextContent
                    content={renderTutorAnswer()}
                    className="!text-black !font-body markdown-body-xs"
                />
            </span>
            {/* hide copilot feedback */}
            <div className="flex gap-[14px] self-end">
                <MdThumbUpAlt
                    onClick={() => {
                        setFeedbackStatus({ status: 'HELPING', answer_id });
                        setIsShowModal(true);
                    }}
                    size={16}
                    className="text-neutral-600 cursor-pointer hover:text-[#00DE09] transition-all"
                />
                <MdThumbUpAlt
                    onClick={() => {
                        setFeedbackStatus({ status: 'NOT_HELPING', answer_id });
                        setIsShowModal(true);
                    }}
                    size={16}
                    className="text-neutral-600 rotate-180 cursor-pointer hover:text-[#db1f1f] transition-all"
                />
            </div>
        </div>
    );
};

const ChatRoom = ({
    uniqueId,
    onClick,
    setIsShowModal,
    setFeedbackStatus
}: ChatRoomProps): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();

    const { video } = useLearning();
    const { data, isLoading } = useGetChatRoomQuery(video.id, {
        skip: video.id === undefined || video.id === null
    });
    const [askTutor] = useAskTutorMutation();
    const room = useRef({} as HTMLDivElement);

    useEffect(() => {
        if (data && data?.messages?.length > 0) {
            room.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [data]);

    return (
        <div className="w-screen md:w-[400px] h-[70vh] bg-[#212121] rounded-t-lg md:rounded-lg z-[100000] text-black overflow-hidden">
            <div
                className="flex h-16 py-3 pl-6 pr-3 bg-accent-purple cursor-pointer"
                aria-hidden
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={onClick}>
                <div className="flex items-center gap-2 w-full">
                    <div className="bg-white p-[6px] rounded-full">
                        <CopilotFill width={27} height={25} />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <span className="inline-block font-extrabold text-xs text-white">
                            Copilot (Beta)
                        </span>
                        <span className="inline-block font-body text-xs text-[#FFFFFF80]">
                            AI Powered
                        </span>
                    </div>
                </div>
                <MdClose
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onClick={onClick}
                    className="text-white text-2xl cursor-pointer"
                />
            </div>
            <div className="h-[calc(70vh-9rem)] w-full overflow-y-auto flex flex-col gap-6 pt-6">
                {isLoading && (
                    <div className="flex flex-col gap-2 p-4">
                        <div className="w-full flex gap-2">
                            <Skeleton className="w-[24px] h-[24px] !rounded-full !bg-neutral-300" />
                            <Skeleton className="w-full h-40 !bg-neutral-300" />
                        </div>
                        <div className="w-full flex gap-2">
                            <Skeleton className="w-[24px] h-[24px] !rounded-full !bg-neutral-300" />
                            <Skeleton className="w-full h-40 !bg-neutral-300" />
                        </div>
                        <div className="w-full flex gap-2">
                            <Skeleton className="w-[24px] h-[24px] !rounded-full !bg-neutral-300" />
                            <Skeleton className="w-full h-40 !bg-neutral-300" />
                        </div>
                    </div>
                )}
                {data?.messages.map((message: AiTutorMessage) => {
                    if (message.agent) {
                        return (
                            <div
                                key={message.id}
                                className="w-full flex px-[18px] md:px-6">
                                <TutorAnswerBubble
                                    message={message}
                                    key={message.id}
                                    setIsShowModal={setIsShowModal}
                                    setFeedbackStatus={setFeedbackStatus}
                                    answer_id={message.id}
                                />
                            </div>
                        );
                    }

                    return (
                        <div
                            key={message.id}
                            className="w-full flex justify-end px-[18px] md:px-6">
                            <StudentQuestionBubble
                                message={message}
                                key={message.id}
                            />
                        </div>
                    );
                })}
                <div id="dummy-box" ref={room} />
            </div>
            <Formik
                initialValues={{
                    query: '',
                    ai_unique_id: uniqueId
                }}
                validate={(values: AskTutorInput) => {
                    const errors = {} as AskTutorInput;
                    if (values.query.length <= 0) {
                        errors.query = 'Pertanyaan tidak boleh kosong';
                    }

                    return errors;
                }}
                onSubmit={async (values, { resetForm }) => {
                    tracker?.trackAttemptFormSubmit(
                        'Question to Copilot',
                        values,
                        {
                            'Course Slug': router.query.id
                        }
                    );
                    await askTutor({
                        ...values
                    });

                    resetForm({
                        values: {
                            query: '',
                            ai_unique_id: uniqueId
                        }
                    });
                    room.current.scrollIntoView({
                        behavior: 'smooth'
                    });
                }}>
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    values
                }) => (
                    <form
                        id="tutor-ai"
                        className="w-full h-20 flex p-6 border-t-2 border-[#373737]"
                        onSubmit={handleSubmit}>
                        <div className="w-full flex justify-end pl-1 pr-5 bg-white rounded-[70px] overflow-hidden">
                            <input
                                className="w-full text-sm font-semibold text-neutral-600 border-none focus:outline-none focus:ring-0 focus:appearance-none"
                                type="text"
                                disabled={isSubmitting}
                                name="query"
                                value={values.query}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Tanya Chatbot"
                            />
                            <div>
                                <Button
                                    className="!p-0 w-full h-full bg-transparent"
                                    variant="custom"
                                    type="submit"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <AiOutlineLoading3Quarters
                                            size={16}
                                            className="animate-spin text-neutral-600"
                                        />
                                    ) : (
                                        <TbSend
                                            size={16}
                                            className="text-neutral-600"
                                        />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default ChatRoom;
