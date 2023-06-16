import { useState } from 'react';
import ChatRoom from './ChatRoom';
import TutorButton from './TutorButton';

interface AiTutorProps {
    uniqueId: string;
}

const AiTutor = ({ uniqueId }: AiTutorProps): JSX.Element => {
    const [openChatRoom, setOpenChatRoom] = useState(false);

    return (
        <div className="fixed bottom-0 md:right-[28vw] z-[100000]">
            {openChatRoom ? (
                <ChatRoom
                    uniqueId={uniqueId}
                    onClick={() => setOpenChatRoom(false)}
                />
            ) : (
                <TutorButton onClick={() => setOpenChatRoom(true)} />
            )}
        </div>
    );
};

export default AiTutor;
