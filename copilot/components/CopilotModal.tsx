import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CopilotSidebarContainer from '../containers/CopilotSidebarContainer';
import CopilotAuthPrompt from '../components/AuthPrompt/AuthPrompt';
import ReferenceModal from '../components/Reference/ReferenceModal';
import ReferenceContentModal from '../components/Reference/ReferenceContentModal';
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
  const [isReferenceContentModalOpen, setIsReferenceContentModalOpen] = useState(false);
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

  const handleOpenReferenceContentModal = () => {
    setIsReferenceContentModalOpen(true);
  };

  const handleCloseReferenceContentModal = () => {
    setIsReferenceContentModalOpen(false);
  };

  const handleReferenceSelect = (
    referenceId: string,
    referenceTitle: string,
    referenceSubtitle: string,
    referenceHeader: string,
    contentType: ReferenceContentType
  ) => {
    const newReference: SelectedReference = {
      id: referenceId,
      title: referenceTitle,
      subtitle: referenceSubtitle,
      header: referenceHeader,
      contentType
    };

    setSelectedReferences(prev => {
      const exists = prev.find(ref => 
        ref.id === referenceId && ref.contentType === contentType
      );
      return exists ? prev : [...prev, newReference];
    });
  };

  const handleRemoveReference = (referenceId: string, contentType: ReferenceContentType) => {
    setSelectedReferences(prev => 
      prev.filter(ref => !(ref.id === referenceId && ref.contentType === contentType))
    );
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
          onOpenReferenceContentModal={handleOpenReferenceContentModal}
          onReferenceSelect={handleReferenceSelect}
          onRemoveReference={handleRemoveReference}
        />
      </div>
      
      <ReferenceModal
        isOpen={isReferenceModalOpen}
        onClose={handleCloseReferenceModal}
        onReferenceSelect={handleReferenceSelect}
      />

      <ReferenceContentModal
        isOpen={isReferenceContentModalOpen}
        onClose={handleCloseReferenceContentModal}
        selectedReferences={selectedReferences}
        onRemoveReference={handleRemoveReference}
        onOpenReferenceModal={() => {
          setIsReferenceContentModalOpen(false);
          setIsReferenceModalOpen(true);
        }}
      />
      
      {isOpen && !isAuthenticated && <CopilotAuthPrompt />}
    </>
  );
};

export default CopilotModal;