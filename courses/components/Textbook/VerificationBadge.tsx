import React from 'react';
import { BsCheck, BsHexagonFill } from 'react-icons/bs';
import { RiRobot2Fill } from 'react-icons/ri';

export const VerificationBadge = ({
    badge
}: Partial<Pick<TextbookProblem['question'], 'badge'>>): JSX.Element => {
    if (!badge) return <></>;

    if (badge === 'generated') {
        return (
            <div className="flex items-center gap-[6px] px-[10px] py-1 rounded-full bg-accent-purple">
                <RiRobot2Fill size={16} />
                <span className="text-xs font-bold text-center">
                    AI Generated
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-[6px] px-[10px] py-1 rounded-full bg-state-success">
            <div className="relative w-[14px] h-[14px]">
                <BsHexagonFill className="text-white" size={14} />
                <BsCheck
                    className="absolute top-0 left-0 text-state-success"
                    size={14}
                />
            </div>
            <span className="text-xs font-bold text-center">
                Diverifikasi Tutor
            </span>
        </div>
    );
};
