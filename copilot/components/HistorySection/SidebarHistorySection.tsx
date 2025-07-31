import { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiOutlineChatAlt } from 'react-icons/hi';
import { cn } from 'commons/utils';
import { chatApi } from '../../redux/api/copilotApi';
import SessionMenuDropdown from './SessionMenuDropdown';
import RenameDialog from './RenameDialog';
import { useTracker } from 'tracker/tracker';
import { SessionHistoryResponse } from 'copilot/types/copilot';

interface SidebarHistorySectionProps {
    isOpen: boolean;
    onClose: () => void;
    bookSlug?: string;
    chapterId?: string;
    onSessionSelect: (sessionId: string) => void;
    currentSessionId?: string;
}

const SidebarHistorySection = ({
    isOpen,
    onClose,
    bookSlug,
    chapterId,
    onSessionSelect,
    currentSessionId
}: SidebarHistorySectionProps): JSX.Element => {
    const [sessionHistory, setSessionHistory] = useState<SessionHistoryResponse['data']>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const tracker = useTracker();

    useEffect(() => {
        const loadContentSessionHistory = async () => {
            if (!isOpen) return;

            try {
                setIsLoading(true);
                const response: SessionHistoryResponse = await chatApi.getContentSessionHistory({
                    book_slug: bookSlug,
                    chapter_id: chapterId
                });
                setSessionHistory(response.data || []);
            } catch (error) {
                console.error('Failed to load content session history:', error);
                setSessionHistory([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadContentSessionHistory();
    }, [isOpen, bookSlug, chapterId]);

    const formatTimestamp = (timestamp: string | null) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRename = async (sessionId: string) => {
        const session = sessionHistory.find((s) => s.id === sessionId);
        if (session) {
            setSelectedSession({ id: sessionId, name: session.name });
            setIsRenameDialogOpen(true);
        }
    };

    const handleRenameSubmit = async (newName: string) => {
        if (!selectedSession) return;

        try {
            await chatApi.renameSession({
                session_id: selectedSession.id,
                name: newName
            });

            setSessionHistory((prev) =>
                prev.map((session) =>
                    session.id === selectedSession.id
                        ? { ...session, name: newName }
                        : session
                )
            );
        } catch (error) {
            console.error('Failed to rename session:', error);
        }
    };

    const handleDelete = async (sessionId: string) => {
        try {
            tracker?.genericTrack('Delete Chat History Session', {
                SESSION_ID: sessionId
            });
            await chatApi.deleteSession(sessionId);

            setSessionHistory((prev) =>
                prev.filter((session) => session.id !== sessionId)
            );

            if (currentSessionId === sessionId) {
                onSessionSelect('');
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const handleSessionClick = (sessionId: string) => {
        tracker?.genericTrack('Click Chat History Session', {
            SESSION_ID: sessionId
        });
        onSessionSelect(sessionId);
        onClose();
    };

    if (!isOpen) return <></>;

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#181818] z-10 flex flex-col">
            <div className="flex flex-col min-h-0 flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <AiOutlineLoading3Quarters
                            className="animate-spin text-neutral-400"
                            size={24}
                        />
                    </div>
                ) : sessionHistory.length > 0 ? (
                    <div className="overflow-y-auto flex-1">
                        {sessionHistory.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => handleSessionClick(session.id)}
                                className="group block w-full text-left border-none bg-transparent p-0 focus:outline-none focus:ring-0">
                                <div className={cn(
                                    "p-3 hover:bg-[#222222] cursor-pointer transition-colors",
                                    currentSessionId === session.id && "bg-[#181818]"
                                )}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">
                                                {session.name}
                                            </h3>
                                            <p className="text-sm text-neutral-400 line-clamp-2">
                                                {session.latest_chat}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="flex flex-row justify-between text-neutral-500 mt-2 block">
                                        {session.latest_chat_at ? (
                                            <span className="text-xs">
                                                {formatTimestamp(session.latest_chat_at)}
                                            </span>
                                        ) : (
                                            <span></span>
                                        )}
                                        <button onClick={(e) => e.stopPropagation()}>
                                            <SessionMenuDropdown
                                                sessionId={session.id}
                                                onRename={handleRename}
                                                onDelete={handleDelete}
                                                isSpecific={true}
                                            />
                                        </button>
                                    </span>
                                </div>
                                <div className="border-b border-neutral-700/50"></div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
                        <HiOutlineChatAlt
                            size={48}
                            className="text-neutral-600"
                        />
                        <h3 className="font-semibold text-neutral-400">
                            Belum ada riwayat chat untuk konten ini
                        </h3>
                        <p className="text-sm text-neutral-500">
                            Riwayat percakapan untuk konten ini akan tersimpan di sini
                        </p>
                    </div>
                )}
            </div>

            {selectedSession && (
                <RenameDialog
                    isOpen={isRenameDialogOpen}
                    onClose={() => setIsRenameDialogOpen(false)}
                    onRename={handleRenameSubmit}
                    initialName={selectedSession.name}
                />
            )}
        </div>
    );
};

export default SidebarHistorySection;