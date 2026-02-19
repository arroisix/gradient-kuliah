import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { useTracker } from 'tracker/tracker';
import CreditDropdown from 'commons/components/CreditDropdown';

const CopilotNavbar = ({
    isHistoryOpen,
    setIsHistoryOpen
}: {
    isHistoryOpen: boolean;
    setIsHistoryOpen: (isOpen: boolean) => void;
}) => {
    const router = useRouter();
    const tracker = useTracker();

    const handleNewChat = () => {
        tracker?.genericTrack('Create Empty Copilot Session');
        router.push('/copilot');
        setIsHistoryOpen(false);
    };

    return (
        <div
            className={cn(
                'hidden',
                'lg:flex justify-end items-center gap-6 mt-8 mr-12 pb-4',
                isHistoryOpen ? 'invisible' : 'visible'
            )}>
            <CreditDropdown />
            <button
                onClick={() => setIsHistoryOpen(true)}
                className="text-white hover:text-neutral-400 transition-colors duration-200">
                <HiOutlineMenuAlt2 size={24} />
            </button>
            <button
                onClick={handleNewChat}
                className="text-white hover:text-neutral-400 transition-colors duration-200">
                <FiEdit size={20} />
            </button>
        </div>
    );
};

const MobileCopilotNavbar = ({
    isHistoryOpen,
    setIsHistoryOpen
}: {
    isHistoryOpen: boolean;
    setIsHistoryOpen: (isOpen: boolean) => void;
}) => {
    const router = useRouter();
    const tracker = useTracker();

    const handleNewChat = () => {
        tracker?.genericTrack('Create Empty Copilot Session');
        router.push('/copilot');
        setIsHistoryOpen(false);
    };

    return (
        <div
            className={cn(
                'flex justify-between items-center py-3 px-4',
                'lg:hidden',
                isHistoryOpen ? 'invisible' : 'visible'
            )}>
            <button
                onClick={() => setIsHistoryOpen(true)}
                className="text-white hover:text-neutral-400 transition-colors duration-200">
                <HiOutlineMenuAlt2 size={24} />
            </button>
            <CreditDropdown />
            <button
                onClick={handleNewChat}
                className="text-white hover:text-neutral-400 transition-colors duration-200">
                <FiEdit size={20} />
            </button>
        </div>
    );
};

CopilotNavbar.Mobile = MobileCopilotNavbar;

export default CopilotNavbar;
