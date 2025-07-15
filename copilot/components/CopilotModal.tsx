import { useState, useEffect } from 'react';
import CopilotSidebarContainer from '../containers/CopilotSidebarContainer';
import { cn } from 'commons/utils';

interface CopilotModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  sessionId?: string;
  xlWidth?: string;
}

const CopilotModal = ({ isOpen, setOpen, sessionId, xlWidth }: CopilotModalProps): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsCollapsed(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={cn(
      "fixed bottom-0 right-0 z-50 rounded-t-lg shadow-lg",
      "w-full sm:w-full md:w-full lg:w-full",
      xlWidth,
      "xl:pr-4",
      isCollapsed ? "h-[72px]" : "h-[70vh] md:h-[90vh]",
      "transition-all duration-300 ease-in-out",
      isOpen ? "translate-y-0" : "translate-y-full",
      !isOpen && "pointer-events-none"
    )}>
      <CopilotSidebarContainer
        sessionId={sessionId}
        isCollapsed={isCollapsed}
        setCollapsed={setIsCollapsed}
        onClose={handleClose}
      />
    </div>
  );
};

export default CopilotModal;