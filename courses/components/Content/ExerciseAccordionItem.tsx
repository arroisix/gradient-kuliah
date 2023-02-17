import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

import Lock from 'commons/components/elements/Icons/Lock';
import { MdOutlineBook } from 'react-icons/md';
import { ContentAccordionItemProps } from './ContentSection';
import Modal from 'commons/components/modules/Modal';
import { useState } from 'react';
import WorksheetInfoModalContent from '../LearningExperience/ExamExercise/WorksheetInfoModal';

const ExerciseAccordionItem = ({
    subchapter,
    chapterId,
    isSubscribed,
    contentPicked,
    slug
}: ContentAccordionItemProps): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [openWorksheetInfo, setOpenWorksheetInfo] = useState<1 | 0>(0);

    const decideOnClickAction = (): void => {
        if (isAuthenticated) {
            setOpenWorksheetInfo(1);
        } else {
            setModalAuthOpen(
                1,
                false,
                `/kelas/${slug}/belajar/latihan/${chapterId}/${subchapter.id}`
            );
        }
    };

    return (
        <>
            <div
                aria-hidden={true}
                onClick={decideOnClickAction}
                key={subchapter.id}
                className={`w-full flex items-center gap-2 px-7 py-2 hover:bg-neutral-600 cursor-pointer ${
                    contentPicked?.id === subchapter?.video?.id &&
                    'bg-neutral-600'
                }`}>
                <div>
                    {subchapter?.exercise?.is_free || isSubscribed ? (
                        <MdOutlineBook className="text-xl" />
                    ) : (
                        <Lock />
                    )}
                </div>
                <span className="font-body w-3/4 truncate">
                    {subchapter?.subchapter_name}
                </span>
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
