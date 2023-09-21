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

    const decideOnClickAction = (): void => {
        if (isAuthenticated) {
            setOpenWorksheetInfo(true);
        } else {
            push(
                `${AUTHENTICATION_ROUTE}?redirect=/kelas/${slug}/belajar/latihan/${chapterId}/${subchapter.id}`
            );
        }
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
                <WorksheetInfoModalContent
                    exercise_id={subchapter.exercise?.id as string}
                    packet_id={subchapter.exercise?.packet_id as string}
                />
            </Modal>
        </>
    );
};

export default ExerciseAccordionItem;
