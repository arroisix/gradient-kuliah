import { useState } from 'react';
import ChatRoom from './ChatRoom';
import TutorButton from './TutorButton';

interface AiTutorProps {
    uniqueId: string;
}

const AiTutor = ({ uniqueId }: AiTutorProps): JSX.Element => {
    const [openChatRoom, setOpenChatRoom] = useState(false);

    return (
        <div className="absolute bottom-0 right-[28vw] z-[100000]">
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
