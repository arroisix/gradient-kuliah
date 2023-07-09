import { useState } from 'react';
import ChatRoom from './ChatRoom';
import TutorButton from './TutorButton';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

interface AiTutorProps {
    uniqueId: string;
}

const AiTutor = ({ uniqueId }: AiTutorProps): JSX.Element => {
    const [openChatRoom, setOpenChatRoom] = useState(false);

    const { isMobileBreakpoints, isDesktopBreakpoints } =
        useWindowBreakpoints();

    return (
        <div
            className={`fixed left-[50%] translate-x-[-50%] md:left-0 md:translate-x-0 md:right-[2vw] flex flex-col md:items-end md:gap-[14px] z-[100000] ${
                isMobileBreakpoints && openChatRoom
                    ? 'bottom-0'
                    : 'bottom-[2vh]'
            }`}>
            {openChatRoom && (
                <ChatRoom
                    uniqueId={uniqueId}
                    onClick={() => setOpenChatRoom(false)}
                />
            )}
            {isDesktopBreakpoints || (isMobileBreakpoints && !openChatRoom) ? (
                <TutorButton onClick={() => setOpenChatRoom((prev) => !prev)} />
            ) : (
                <></>
            )}
        </div>
    );
};

export default AiTutor;
