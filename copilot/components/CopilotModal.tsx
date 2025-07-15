import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useState } from 'react';
import CopilotSidebarContainer from '../containers/CopilotSidebarContainer';
import { cn } from 'commons/utils';

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

    const handleClose = () => {
        setIsCollapsed(false);
        setOpen(false);
    };

    if (!isOpen) return <></>;

    return (
        <div 
            className={cn(
                "fixed bottom-0 right-0 z-50 flex flex-col rounded-t-lg shadow-lg",
                "w-full sm:w-full md:w-full lg:w-full xl:w-[29.5rem]",
                isCollapsed ? "h-auto" : "h-[70vh] sm:h-[90vh] md:h-[85vh] lg:h-[90vh]"
            )}>
            
            <div className="flex items-center justify-between py-4 px-5 bg-[#2C2C2C] border-b border-gray-700 flex-shrink-0 rounded-t-lg">
                <button
                    onClick={handleClose}
                    className="p-1 text-gray-400 hover:text-white transition-colors">
                    <IoClose size={20} />
                </button>
                
                <h3 className="text-white font-extrabold text-base xl:text-lg">Copilot AI</h3>

                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 text-gray-400 hover:text-white transition-colors">
                    {isCollapsed ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                </button>
            </div>
            
            <div
                className={cn(
                    "flex-1 min-h-0 overflow-hidden",
                    isCollapsed && "hidden"
                )}>
                <CopilotSidebarContainer sessionId={sessionId} />
            </div>
        </div>
    );
};

export default CopilotModal;