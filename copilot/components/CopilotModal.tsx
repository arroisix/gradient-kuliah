import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useState } from 'react';
import CopilotSidebarContainer from '../containers/CopilotSidebarContainer';

interface CopilotModalProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    sessionId?: string;
}

const CopilotModal = ({
    isOpen,
    setOpen,
    sessionId
}: CopilotModalProps): JSX.Element => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!isOpen) return <></>;

    return (
        <div 
            className="fixed bottom-0 right-2 md:right-5 z-50 w-full max-w-md md:w-[28rem] lg:w-[32rem] bg-[#121212] flex flex-col rounded-t-lg shadow-lg"
            style={{ 
                height: isCollapsed ? 'auto' : '90vh',
                maxHeight: '90vh'
            }}>
            
            <div className="flex items-center justify-between py-4 px-5 bg-[#1D1D1D] border-b border-gray-700 flex-shrink-0 rounded-t-lg">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 text-gray-400 hover:text-white transition-colors">
                    {isCollapsed ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                </button>
                
                <h3 className="text-white font-extrabold text-base xl:text-lg">Copilot AI</h3>
                
                <button
                    onClick={() => setOpen(false)}
                    className="p-1 text-gray-400 hover:text-white transition-colors">
                    <IoClose size={20} />
                </button>
            </div>
            
            {!isCollapsed && (
                <div className="flex-1 min-h-0 overflow-hidden">
                    <CopilotSidebarContainer sessionId={sessionId} />
                </div>
            )}
        </div>
    );
};

export default CopilotModal;