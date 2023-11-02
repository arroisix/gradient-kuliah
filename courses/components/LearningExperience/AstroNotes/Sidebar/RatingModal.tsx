import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import Modal from 'commons/components/modules/Modal';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { usePostRatingMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReferralModal from 'referral/components/ReferralModal';
import { useTracker } from 'tracker/tracker';

const RatingModal = (): JSX.Element => {
    const tracker = useTracker();

    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const { isModalRatingOpen, setIsModalRatingOpen } = useAstronotes();
    const { theme } = useThemeContext();

    const [rating, setRating] = useState(0);
    const CONSTANT_RATING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const router = useRouter();
    const { slug, page } = router.query;
    const [postRating, { isLoading, isSuccess }] = usePostRatingMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success('Rating berhasil disimpan');
            setIsModalRatingOpen(false);
            if (rating >= 6) setIsReferralModalOpen(true);
        }
    }, [isSuccess]);

    return (
        <>
            <Modal
                isOpen={isModalRatingOpen}
                setOpen={setIsModalRatingOpen}
                variant={theme}
                className="sm:!w-[500px] !max-w-[500px]">
                <div className="flex flex-col gap-6">
                    <span className="inline-block mr-5 font-extrabold">
                        Seberapa membantu buku ini dalam pelajaranmu?
                    </span>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center gap-2 p-6 border dark:border-neutral-600 rounded-box">
                            {CONSTANT_RATING.map((value) => (
                                <span
                                    key={value}
                                    className={`w-[22px] h-[22px] sm:w-[32px] sm:h-[32px] flex justify-center items-center hover:opacity-90 transition font-bold rounded-full cursor-pointer ${
                                        rating === value
                                            ? 'bg-accent-purple text-white dark:text-accent-purple dark:bg-white'
                                            : 'bg-neutral-200 dark:bg-neutral-400 text-[#333333]'
                                    }`}
                                    onClick={() => setRating(value)}
                                    aria-hidden>
                                    {value}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <span className="inline-block font-body text-[10px]">
                                Tidak membantu
                            </span>
                            <span className="inline-block font-body text-[10px]">
                                Sangat membantu
                            </span>
                        </div>
                    </div>
                    <Button
                        className="self-end px-12 text-sm"
                        size="small"
                        variant="primary"
                        onClick={() => {
                            const payload = {
                                slug: slug as string,
                                rate: rating / 2
                            };
                            tracker?.trackAttemptFormSubmit(
                                'Book Rating',
                                payload,
                                { 'Book Slug': slug, 'Book Page Query': page }
                            );
                            postRating(payload);
                        }}>
                        {isLoading ? (
                            <Spinner size="small" className="border-black" />
                        ) : (
                            'Kirim'
                        )}
                    </Button>
                </div>
            </Modal>
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </>
    );
};

export default RatingModal;
