import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTracker } from 'tracker/tracker';
import ModalCourseFeedback from '../CourseDetailBox/ModalCourseFeedback';
import Button from 'commons/components/elements/Button';
import { Star } from 'lucide-react';

interface RatingButtonProps {
    disabled?: boolean;
}

function RatingButton({ disabled }: RatingButtonProps): JSX.Element {
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] = useState(false);
    const tracker = useTracker();
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const handleClickBtn = () => {
        tracker?.trackButtonClick('Rating Course', 'Rating', {
            courseSlug: slug_subtest
        });
        setIsModalFeedbackOpen(true);
    };

    return (
        <>
            <ModalCourseFeedback
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
            />
            <Button
                disabled={disabled}
                variant="neutral"
                size="small"
                onClick={handleClickBtn}
                className="group flex items-center gap-1.5 text-sm w-full !p-2 lg:!py-2 lg:!px-4">
                <Star className="fill-white group-disabled:fill-neutral-300/30 w-4 h-4" />
                <span className="hidden lg:block">Rating</span>
            </Button>
        </>
    );
}

export { RatingButton };
