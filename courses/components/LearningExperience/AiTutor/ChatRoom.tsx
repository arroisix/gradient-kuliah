import Button from 'commons/components/elements/Button';
import { generateInitial } from 'commons/utils';
import { FaRobot } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import {
    useAskTutorMutation,
    useGetChatRoomQuery
} from 'courses/redux/api/aiTutorApi';

import { Formik } from 'formik';
import { MouseEventHandler } from 'react';

interface ChatRoomProps {
    uniqueId: string;
    onClick: (event: boolean) => void | MouseEventHandler<HTMLDivElement>;
}

interface BubbleProps {
    message: AiTutorMessage;
}

const StudentQuestionBubble = ({ message }: BubbleProps): JSX.Element => {
    const user = useSelector(getCurrentUser);

    return (
        <div className="w-full bg-neutral-100 p-4 flex gap-2">
            <span className="text-2xl font-bold">
                {generateInitial(user.full_name)}
            </span>
            <span>{message.message.message}</span>
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
            console.log('rusak');
            return message.message.message;
        }
    };

    return (
        <div className="w-full bg-neutral-300 p-4 flex gap-2">
            <div>
                <FaRobot className="text-2xl text-center" />
            </div>
            <span>{renderTutorAnswer()}</span>
        </div>
    );
};

const ChatRoom = ({ uniqueId, onClick }: ChatRoomProps): JSX.Element => {
    const { data } = useGetChatRoomQuery();
    const [askTutor] = useAskTutorMutation();

    return (
        <div className="w-[30vw] h-[70vh] bg-white rounded-t-lg z-[100000] text-black">
            <div
                className="flex h-16 justify-between items-center p-4 border-b border-neutral-200 cursor-pointer"
                aria-hidden
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={onClick}>
                <h3 className="text-2xl font-bold">
                    Gradient AI Tutor (alpha)
                </h3>
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
                                name="query"
                                value={values.query}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={
                                    'Jelaskan ulang yang dijelaskan pada menit ke 2'
                                }
                                className="bg-transparent transition-all resize-none h-full w-full border-transparent focus:border-transparent focus:ring-0 focus:ring-transparent"
                            />
                        </div>
                        <div className="w-full p-4 flex justify-end items-center bg-neutral-200">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}>
                                {isSubmitting ? 'Mencari jawaban...' : 'Tanya'}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default ChatRoom;
