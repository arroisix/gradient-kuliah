import { Dispatch, SetStateAction, useState } from 'react';
import ChatRoom from './ChatRoom';
import TutorButton from './TutorButton';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useTracker } from 'tracker/tracker';

interface AiTutorProps {
    uniqueId: string;
    setIsShowModal: Dispatch<SetStateAction<boolean>>;
    setFeedbackStatus: Dispatch<
        SetStateAction<{
            status: 'NOT_HELPING' | 'HELPING' | 'NOT_SELECTED';
            answer_id: string;
        }>
    >;
}

const AiTutor = ({
    uniqueId,
    setIsShowModal,
    setFeedbackStatus
}: AiTutorProps): JSX.Element => {
    const tracker = useTracker();

    const [openChatRoom, setOpenChatRoom] = useState(false);

    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <div
            className={`fixed w-min left-[50%] translate-x-[-50%] md:left-auto md:translate-x-0 md:right-[2vw] flex flex-col md:items-end md:gap-[14px] z-[100000] ${
                isMobileBreakpoints && openChatRoom
                    ? 'bottom-0'
                    : 'bottom-[2vh]'
            }`}>
            {openChatRoom && (
                <ChatRoom
                    uniqueId={uniqueId}
                    onClick={() => setOpenChatRoom(false)}
                    setIsShowModal={setIsShowModal}
                    setFeedbackStatus={setFeedbackStatus}
                />
            )}
            {!isMobileBreakpoints || (isMobileBreakpoints && !openChatRoom) ? (
                <TutorButton
                    onClick={() => {
                        tracker?.genericTrack('Click Ask Copilot Button');
                        setOpenChatRoom((prev) => !prev);
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    );
};

export default AiTutor;
