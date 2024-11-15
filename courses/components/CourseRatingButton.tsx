import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTracker } from 'tracker/tracker';
import ModalCourseFeedback from './CourseDetailBox/ModalCourseFeedback';
import Button from 'commons/components/elements/Button';
import { Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

const RatingButton = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const tracker = useTracker();
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);

    if (isAuthenticated) {
        return (
            <>
                <ModalCourseFeedback
                    isOpen={isModalFeedbackOpen}
                    setOpen={setIsModalFeedbackOpen}
                />
                <Button
                    variant="neutral"
                    size="small"
                    onClick={() => {
                        tracker?.trackButtonClick('Rating Course', 'Rating', {
                            courseId: id
                        });
                        setIsModalFeedbackOpen(true);
                    }}
                    className="text-xs w-full flex gap-2 items-center justify-center">
                    <Star size={14} />
                    Rating
                </Button>
            </>
        );
    }

    return <></>;
};

export default RatingButton;
