import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import { usePostRatingMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type RatingModalProps = {
    setOpen: (status: 1 | 0) => void;
};

const RatingModal = ({ setOpen }: RatingModalProps): JSX.Element => {
    const [rating, setRating] = useState(0);
    const CONSTANT_RATING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const router = useRouter();
    const { slug } = router.query;
    const [postRating, { isLoading, isSuccess }] = usePostRatingMutation();

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-8">
            <span className="inline-block font-extrabold mr-5">
                Seberapa membantu buku ini dalam pelajaranmu?
            </span>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                    {CONSTANT_RATING.map((value) => (
                        <span
                            key={value}
                            className={`w-[22px] h-[22px] sm:w-[32px] sm:h-[32px] flex justify-center items-center hover:bg-white font-bold text-[#333333] rounded-full cursor-pointer ${
                                rating === value ? 'bg-white' : 'bg-neutral-400'
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
                variant="custom"
                className="bg-white text-black text-xs"
                onClick={() =>
                    postRating({ slug: slug as string, rate: rating / 2 })
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

export default RatingModal;
