import Button from 'commons/components/elements/Button';
import { MdClose } from 'react-icons/md';
import {
    useAskTutorMutation,
    useGetChatRoomQuery
} from 'courses/redux/api/aiTutorApi';

import { Formik } from 'formik';
import { MouseEventHandler, useEffect, useRef } from 'react';
import { useLearning } from 'courses/contexts/LearningProvider';
import Spinner from 'commons/components/elements/Spinner';
import { useAuth } from 'authentication/contexts/AuthProvider';
import Image from 'next/image';
import Avatar from 'react-avatar';
import TextContent from './TextContent';

interface ChatRoomProps {
    uniqueId: string;
    onClick: (event: boolean) => void | MouseEventHandler<HTMLDivElement>;
}

interface BubbleProps {
    message: AiTutorMessage;
}

export const processMessage = (message: string): JSX.Element[] => {
    const messagesClean = message.split('\n');

    return messagesClean.map((m: string) => <p key={m}>{m}</p>);
};

const StudentQuestionBubble = ({ message }: BubbleProps): JSX.Element => {
    const { profile } = useAuth();

    return (
        <div className="w-full bg-neutral-100 p-4 flex gap-2">
            {!profile ? (
                <div className="w-[24px] h-[24px] bg-neutral-600 animate-pulse rounded-full"></div>
            ) : !!profile.photo_profile ? (
                <div className="w-[24px] h-[24px] relative">
                    <Image
                        src={profile.photo_profile}
                        layout="fill"
                        className="rounded-full w-[24px] h-[24px]"
                    />
                </div>
            ) : (
                <Avatar name={profile.full_name} size="24" round />
            )}
            <TextContent content={message.message.message} />
        </div>
    );
};

const TutorAnswerBubble = ({ message }: BubbleProps): JSX.Element => {
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
        <div className="w-full bg-neutral-300 p-4 flex gap-2">
            <div>
                <div className="bg-white rounded-full flex justify-center items-center w-[24px] h-[24px]">
                    <span className="text-xl font-bold cursor-pointer font-[Urbanist]">
                        G
                    </span>
                </div>
            </div>
            <TextContent content={renderTutorAnswer()} />
        </div>
    );
};

const ChatRoom = ({ uniqueId, onClick }: ChatRoomProps): JSX.Element => {
    const { video } = useLearning();
    const { data } = useGetChatRoomQuery(video.id, {
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
        <div className="w-screen md:w-[400px] h-[70vh] bg-white rounded-t-lg z-[100000] text-black">
            <div
                className="flex h-16 justify-between items-center p-4 border-b border-neutral-200 cursor-pointer"
                aria-hidden
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={onClick}>
                <h3 className="text-2xl font-bold">Tutor Gradient</h3>
                <MdClose
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onClick={onClick}
                    className="text-2xl cursor-pointer"
                />
            </div>
            <div className="h-[calc(50vh-4rem)] w-full overflow-y-auto">
                {data?.messages.map((message: AiTutorMessage) => {
                    if (message.agent) {
                        return (
                            <TutorAnswerBubble
                                message={message}
                                key={message.id}
                            />
                        );
                    }

                    return (
                        <StudentQuestionBubble
                            message={message}
                            key={message.id}
                        />
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
                        className="w-full h-[20vh] flex flex-col justify-end"
                        onSubmit={handleSubmit}>
                        <div className="border-y h-full border-neutral-200">
                            <textarea
                                disabled={isSubmitting}
                                name="query"
                                value={values.query}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={
                                    'ex: Tolong jelaskan ulang yang dijelaskan pada menit ke 2, saya kurang paham'
                                }
                                className="bg-transparent transition-all resize-none h-full w-full border-transparent focus:border-transparent focus:ring-0 focus:ring-transparent"
                            />
                        </div>
                        <div className="w-full p-4 flex justify-end items-center bg-neutral-200">
                            {isSubmitting ? (
                                <Spinner size="small" />
                            ) : (
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting}>
                                    Tanya
                                </Button>
                            )}
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default ChatRoom;
