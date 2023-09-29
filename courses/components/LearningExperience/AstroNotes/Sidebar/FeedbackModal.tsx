import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import Modal from 'commons/components/modules/Modal';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { usePostFeedbackMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';

const FeedbackModal = (): JSX.Element => {
    const tracker = useTracker();

    const { isModalFeedbackOpen, setIsModalFeedbackOpen } = useAstronotes();
    const { theme } = useThemeContext();
    const [content, setContent] = useState('');

    const router = useRouter();
    const { slug, page } = router.query;
    const [postFeedback, { isLoading, isSuccess }] = usePostFeedbackMutation();

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const payload = {
            slug: slug as string,
            feedback: content
        };
        tracker?.trackAttemptFormSubmit('Book Feedback', payload, {
            'Book Slug': slug,
            'Book Page Query': page
        });
        postFeedback(payload);
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success('Pesan berhasil disimpan.');
            setIsModalFeedbackOpen(false);
            setContent('');
        }
    }, [isSuccess, setIsModalFeedbackOpen]);

    return (
        <Modal
            isOpen={isModalFeedbackOpen}
            setOpen={setIsModalFeedbackOpen}
            variant={theme}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                    type="submit">
                    {isLoading ? (
                        <Spinner size="small" className="border-black" />
                    ) : (
                        'Kirim'
                    )}
                </Button>
            </form>
        </Modal>
    );
};

export default FeedbackModal;
