import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import { usePostFeedbackMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type FeedbackModalProps = {
    setOpen: (status: boolean) => void;
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
            setOpen(false);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-6">
            <span className="inline-block mr-5 font-extrabold">
                Bantuan dan Masukan
            </span>
            <div>
                <TextareaAutosize
                    value={content}
                    name="feedback"
                    onChange={handleChange}
                    placeholder="Kirim masukan ke Buku Gradient"
                    className="w-full h-full min-h-[124px] p-[10px] font-body text-xs bg-neutral-100 dark:bg-neutral-700 border-none rounded-[8px] focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-400"
                />
            </div>
            <Button
                variant="primary"
                className="self-end px-12 text-sm"
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
