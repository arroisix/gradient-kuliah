import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Pen from 'commons/components/elements/Icons/Pen';
import Modal from 'commons/components/modules/Modal';
import { cn } from 'commons/utils';
import WorksheetInfoModalContent from 'courses/components/LearningExperience/ExamExercise/WorksheetInfoModal';
import VideoPaywall from 'courses/components/VideoPlayerContainer/VideoPaywall';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { HiLockClosed } from 'react-icons/hi';

const ExerciseItem = ({ value }: { value: SubChapter }): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const { sub } = router.query;

    const [openWorksheetInfo, setOpenWorksheetInfo] = useState<boolean>(false);
    const renderExerciseContent = (): JSX.Element => {
        if (isLandingPageRevampOn && !is_subscribed) {
            return (
                <VideoPaywall header="Beli untuk mengakses latihan soal ini" />
            );
        }

        return (
            <WorksheetInfoModalContent
                exercise_id={value.exercise_id as string}
                packet_id={value.packet_id as string}
            />
        );
    };

    return (
        <>
            <div
                key={value.id}
                className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
                onClick={() => setOpenWorksheetInfo(true)}
                aria-hidden>
                <div
                    className={`flex items-center gap-[10px] ${
                        sub === value.id ? 'w-[65%]' : 'w-[80%]'
                    }`}>
                    <div className="w-[18px] h-[18px]">
                        {value.is_free || is_subscribed ? (
                            <Pen />
                        ) : (
                            <HiLockClosed className="text-neutral-600" />
                        )}
                    </div>
                    <span
                        className={cn(
                            'inline-block overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis',
                            !is_subscribed &&
                                !value.is_free &&
                                'text-neutral-600'
                        )}>
                        {value.exercise_name}
                    </span>
                </div>
            </div>
            <Modal
                isOpen={openWorksheetInfo}
                setOpen={setOpenWorksheetInfo}
                className={cn(
                    isLandingPageRevampOn &&
                        !is_subscribed &&
                        'max-w-screen-md xl:max-w-screen-lg'
                )}
                variant="dark">
                {renderExerciseContent()}
            </Modal>
        </>
    );
};

export default ExerciseItem;
