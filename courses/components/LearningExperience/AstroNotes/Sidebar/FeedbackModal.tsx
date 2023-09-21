import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import { usePostFeedbackMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type FeedbackModalProps = {
    setOpen: (status: 1 | 0) => void;
};

const FeedbackModal = ({ setOpen }: FeedbackModalProps): JSX.Element => {
    const [content, setContent] = useState('');

    const router = useRouter();
    const { slug } = router.query;
    const [postFeedback, { isLoading, isSuccess }] = usePostFeedbackMutation();

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
    }

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-8">
            <span className="inline-block font-extrabold mr-5">
                Bantuan dan Masukan
            </span>
            <div>
                <TextareaAutosize
                    value={content}
                    name="feedback"
                    onChange={handleChange}
                    placeholder="Kirim masukan ke Buku Gradient"
                    className="w-full h-full min-h-[124px] p-[10px] font-body text-xs bg-[#242424] border-none rounded-[8px] focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-400"
                />
            </div>
            <Button
                variant="custom"
                className="bg-white text-black text-xs"
                onClick={() =>
                    postFeedback({ slug: slug as string, feedback: content })
                }>
                {isLoading ? (
                    <Spinner size="small" className="border-black" />
                ) : (
                    'Kirim'
                )}
            </Button>
        </div>
    );
};

export default FeedbackModal;
