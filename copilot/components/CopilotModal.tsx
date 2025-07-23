import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CopilotSidebarContainer from '../containers/CopilotSidebarContainer';
import CopilotAuthPrompt from '../components/AuthPrompt/AuthPrompt';
import ReferenceModal from '../components/Reference/ReferenceModal';
import { ReferenceContentType, SelectedReference } from '../types/copilot';
import { cn } from 'commons/utils';

interface CopilotModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  sessionId?: string;
  xlWidth?: string;
  currentContext?: SelectedReference;
}

const CopilotModal = ({
  isOpen,
  setOpen,
  sessionId,
  xlWidth,
  currentContext
}: CopilotModalProps): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [selectedReferences, setSelectedReferences] = useState<SelectedReference[]>([]);
  const isAuthenticated = useSelector(getIsAuthenticated);

  useEffect(() => {
    if (isOpen) {
      setIsCollapsed(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentContext) {
      setSelectedReferences(prev => {
        const exists = prev.find(ref =>
          ref.id === currentContext.id && ref.contentType === currentContext.contentType
        );

        if (!exists) {
          return [currentContext, ...prev];
        }

        return prev;
      });
    }
  }, [isOpen, currentContext]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenReferenceModal = () => {
    setIsReferenceModalOpen(true);
  };

  const handleCloseReferenceModal = () => {
    setIsReferenceModalOpen(false);
  };

  const handleReferenceSelect = (
    referenceId: string,
    referenceTitle: string,
    contentType: ReferenceContentType,
    subtitle: string,
    header: string
  ) => {
    const newReference: SelectedReference = {
      id: referenceId,
      title: referenceTitle,
      subtitle: subtitle,
      header: header,
      contentType
    };

    setSelectedReferences(prev => {
      const exists = prev.find(ref =>
        ref.id === referenceId && ref.contentType === contentType
      );
      return exists ? prev : [...prev, newReference];
    });
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-0 right-0 z-50 rounded-t-lg shadow-lg",
        "w-full sm:w-full md:w-full lg:w-full",
        xlWidth,
        "xl:pr-4",
        isCollapsed ? "h-[68px]" : "h-[70vh] xl:h-[90vh]",
        "transition-all duration-300 ease-in-out",
        isOpen ? "translate-y-0" : "translate-y-full",
        !isOpen && "pointer-events-none",
        "flex flex-col overflow-hidden"
      )}>
        <CopilotSidebarContainer
          sessionId={sessionId}
          isCollapsed={isCollapsed}
          selectedReferences={selectedReferences}
          onCollapsedChange={setIsCollapsed}
          onClose={handleClose}
          onOpenReferenceModal={handleOpenReferenceModal}
        />
      </div>

      <ReferenceModal
        isOpen={isReferenceModalOpen}
        onClose={handleCloseReferenceModal}
        onReferenceSelect={handleReferenceSelect}
      />

      {isOpen && !isAuthenticated && <CopilotAuthPrompt />}
    </>
  );
};

export default CopilotModal;