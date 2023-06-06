import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

import Lock from 'commons/components/elements/Icons/Lock';
import { MdTask } from 'react-icons/md';
import { ContentAccordionItemProps } from './ContentSection';
import Modal from 'commons/components/modules/Modal';
import { useState } from 'react';
import WorksheetInfoModalContent from '../LearningExperience/ExamExercise/WorksheetInfoModal';
import { useRouter } from 'next/router';

const ExerciseAccordionItem = ({
    subchapter,
    isSubscribed,
    contentPicked
}: ContentAccordionItemProps): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [openWorksheetInfo, setOpenWorksheetInfo] = useState<1 | 0>(0);
    const { push } = useRouter();

    const decideOnClickAction = (): void => {
        if (isAuthenticated) {
            setOpenWorksheetInfo(1);
        } else {
            // TODO: Implement redirection for `/kelas/${slug}/belajar/latihan/${chapterId}/${subchapter.id}`
            push('/masuk');
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
