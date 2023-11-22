import Pen from 'commons/components/elements/Icons/Pen';
import Modal from 'commons/components/modules/Modal';
import WorksheetInfoModalContent from 'courses/components/LearningExperience/ExamExercise/WorksheetInfoModal';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const ExerciseItem = ({ value }: { value: SubChapter }): JSX.Element => {
    const router = useRouter();
    const { sub } = router.query;

    const [openWorksheetInfo, setOpenWorksheetInfo] = useState<boolean>(false);

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
                        <Pen />
                    </div>
                    <span className="inline-block overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis">
                        {value.exercise_name}
                    </span>
                </div>
            </div>
            <Modal
                isOpen={openWorksheetInfo}
                setOpen={setOpenWorksheetInfo}
                variant="dark">
                <WorksheetInfoModalContent
                    exercise_id={value.exercise_id as string}
                    packet_id={value.packet_id as string}
                />
            </Modal>
        </>
    );
};

export default ExerciseItem;
