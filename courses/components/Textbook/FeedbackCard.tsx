import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { cn } from 'commons/utils';
import {
    useGetBookDetailQuery,
    useGetTextbookSolutionQuery,
    usePostTextbookFeedbackMutation
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

export const FeedbackCard = ({
    review,
    isLoading
}: Partial<Pick<TextbookProblem, 'review'>> & {
    isLoading: boolean;
}): JSX.Element => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [content, setContent] = useState(review?.comment ?? '');

    useEffect(() => {
        setRating(review?.rating ?? 0);
        setContent(review?.comment ?? '');
    }, [review?.rating, review?.comment, isLoading]);

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
    }

    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { slug, problemSlug } = router.query as {
        slug: string;
        problemSlug: string;
    };

    const { data } = useGetBookDetailQuery({ slug }, { skip: !slug });
    const book = data?.book;

    const { data: textbookProblem } = useGetTextbookSolutionQuery(
        { slug, problemSlug },
        { skip: book?.category !== 'Textbook' }
    );

    const [submitRating, { isLoading: isSubmitting }] =
        usePostTextbookFeedbackMutation();
    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (!book || !isAuthenticated) return;

        submitRating({
            slug,
            problemSlug:
                book.category === 'Textbook'
                    ? (textbookProblem?.problem.id as string)
                    : problemSlug,
            category: book.category,
            rating,
            comment: content
        }).then(() => {
            dialogRef.current?.close();
            toast.success('Masukan berhasil terkirim');
        });
    }

    return (
        <div
            className={cn(
                'bg-[#121212] border border-neutral-900 rounded-lg px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between transition',
                isLoading && '*:opacity-0 animate-pulse'
            )}>
            <p className="text-sm font-medium">
                Berikan penilaian untuk membantu kami meningkatkan kualitas
                jawaban
            </p>
            <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            dialogRef.current?.showModal();
                            setRating(i + 1);
                        }}
                        disabled={isLoading}
                        className={cn(
                            'mask mask-star-2 h-10 w-10 md:h-8 md:w-8',
                            i + 1 <= rating
                                ? 'bg-accent-yellow'
                                : 'bg-neutral-700',
                            isLoading && '!bg-neutral-800 animate-pulse'
                        )}></button>
                ))}
            </div>
            <dialog
                id="feedback-sheet"
                ref={dialogRef}
                className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-neutral-900">
                    <form method="dialog">
                        <button
                            onClick={() => setRating(0)}
                            className="absolute btn btn-sm btn-circle btn-ghost right-4 top-4">
                            ✕
                        </button>
                    </form>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4">
                        <h3 className="text-lg font-bold">Tulis Masukan</h3>
                        <p>
                            Apakah jawaban dan pembahasan yang diberikan
                            membantu?
                        </p>
                        <div className="flex justify-center gap-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() =>
                                        isSubmitting ? {} : setRating(i + 1)
                                    }
                                    disabled={isSubmitting}
                                    className={cn(
                                        'mask mask-star-2 h-8 w-8 transition',
                                        i + 1 <= rating
                                            ? 'bg-accent-yellow'
                                            : 'bg-neutral-700'
                                    )}></button>
                            ))}
                        </div>
                        <div>
                            <TextareaAutosize
                                value={content}
                                name="feedback"
                                onChange={handleChange}
                                placeholder="Tuliskan masukanmu"
                                className="w-full h-full min-h-[124px] p-[10px] font-body text-sm bg-neutral-800 border-none rounded-[8px] focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-400"
                            />
                        </div>
                        <Button
                            type={isAuthenticated ? 'submit' : 'button'}
                            href={isAuthenticated ? undefined : '/masuk'}
                            variant="primary"
                            disabled={isSubmitting}
                            className={cn(
                                'w-full text-center',
                                isSubmitting && 'btn-disabled'
                            )}>
                            Kirim Masukan
                        </Button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};
