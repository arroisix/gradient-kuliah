import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

import Lock from 'commons/components/elements/Icons/Lock';
import { MdTask } from 'react-icons/md';
import { ContentAccordionItemProps } from './ContentSection';
import Modal from 'commons/components/modules/Modal';
import { useState } from 'react';
import WorksheetInfoModalContent from '../LearningExperience/ExamExercise/WorksheetInfoModal';
import { useRouter } from 'next/router';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Paywall from 'commons/components/elements/Paywall';

const ExerciseAccordionItem = ({
    subchapter,
    isSubscribed,
    contentPicked,
    slug,
    chapterId
}: ContentAccordionItemProps): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [openWorksheetInfo, setOpenWorksheetInfo] = useState<boolean>(false);
    const { push } = useRouter();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const decideOnClickAction = (): void => {
        if (!isAuthenticated) {
            push(
                `${AUTHENTICATION_ROUTE}?redirect=/kelas/${slug}/belajar/latihan/${chapterId}/${subchapter.id}`
            );
        } else {
            setOpenWorksheetInfo(true);
        }
    };

    const renderExerciseContent = (): JSX.Element => {
        console.log(
            '🚀 ~ file: ExerciseAccordionItem.tsx:41 ~ renderExerciseContent ~ props:',
            {
                isFree: subchapter?.exercise?.is_free,
                isSubscribed,
                isAuthenticated
            }
        );
        if (isLandingPageRevampOn) {
            if (!isSubscribed) {
                if (!isAuthenticated) return <>register dulu</>;
                else if (!subchapter?.exercise?.is_free) return <Paywall />;
            }
        }

        return (
            <WorksheetInfoModalContent
                exercise_id={subchapter.exercise?.id as string}
                packet_id={subchapter.exercise?.packet_id as string}
            />
        );
    };

    return (
        <>
            <div
                aria-hidden={true}
                onClick={decideOnClickAction}
                key={subchapter.id}
                className={`w-full flex items-center gap-2 px-7 py-2 hover:bg-[#272727] cursor-pointer ${
                    contentPicked?.id === subchapter?.video?.id &&
                    'bg-[#272727]'
                }`}>
                <div>
                    {subchapter?.exercise?.is_free || isSubscribed ? (
                        <MdTask className="text-xl" />
                    ) : (
                        <Lock />
                    )}
                </div>
                <span className="font-body">{subchapter?.subchapter_name}</span>
            </div>
            <Modal
                isOpen={openWorksheetInfo}
                setOpen={setOpenWorksheetInfo}
                variant="dark">
                {renderExerciseContent()}
            </Modal>
        </>
    );
};

export default ExerciseAccordionItem;
