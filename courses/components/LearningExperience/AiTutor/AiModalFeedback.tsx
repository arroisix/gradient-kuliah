import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import { useAITutorFeedbackMutation } from 'courses/redux/api/aiTutorApi';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MdThumbUpAlt } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize';

const AiModalFeedback = ({
    feedbackStatus,
    setOpen
}: {
    feedbackStatus: {
        status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
        answer_id: string;
    };
    setOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    const [content, setContent] = useState('');

    const [postFeedback, { isLoading, isSuccess }] =
        useAITutorFeedbackMutation();

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
    }

    function handleSubmit(): void {
        postFeedback({
            feedback_status: feedbackStatus.status,
            feedback_content: content,
            answer_id: feedbackStatus.answer_id
        });
    }

    useEffect(() => {
        if (isSuccess) {
            setOpen(false);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-[14px]">
                <div
                    className={`w-[28px] h-[28px] flex justify-center items-center rounded-full ${
                        feedbackStatus.status === 'HELPING'
                            ? 'bg-[#00880033]'
                            : 'bg-[#B73E3233]'
                    }`}>
                    <MdThumbUpAlt
                        size={16}
                        className={`${
                            feedbackStatus.status === 'HELPING'
                                ? 'text-state-success'
                                : 'text-[#B92011]'
                        }`}
                    />
                </div>
                <span className="inline-block font-bold">
                    Masukan dan Saran
                </span>
            </div>
            <div>
                <TextareaAutosize
                    value={content}
                    name="feedback"
                    onChange={handleChange}
                    placeholder={
                        feedbackStatus.status === 'HELPING'
                            ? 'Apa yang kamu sukai dengan jawaban Copilot?'
                            : 'Apa yang tidak kamu sukai dari jawaban Copilot?'
                    }
                    className="w-full h-full min-h-[124px] p-[10px] font-body text-xs bg-[#242424] border-none rounded-[10px] focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-600"
                />
            </div>
            <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
                disabled={!content}>
                {isLoading ? <Spinner size="small" /> : 'Kirim'}
            </Button>
        </div>
    );
};

export default AiModalFeedback;
