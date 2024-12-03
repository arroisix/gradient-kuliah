import {
    BookmarkedChatsResponse,
    SessionHistoryResponse
} from '../../types/copilot';
import Link from 'next/link';
import { useState, useEffect, useMemo, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiCopy, BiSearch } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from 'commons/utils';
import { chatApi } from '../../redux/api/copilotApi';
import { useRouter } from 'next/router';
import CopilotIcon from 'copilot/assets/CopilotIcon';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import SessionMenuDropdown from './SessionMenuDropdown';
import RenameDialog from './RenameDialog';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { BsBookmark } from 'react-icons/bs';

interface HistorySectionProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    isMobile?: boolean;
}

const HistorySection = ({
    isOpen,
    onClose,
    onOpen,
    isMobile = false
}: HistorySectionProps): JSX.Element => {
    const router = useRouter();
    const [bookmarkedChats, setBookmarkedChats] = useState<
        BookmarkedChatsResponse['data']
    >([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchDebounce = useRef<NodeJS.Timeout>();
    const [sessionHistory, setSessionHistory] = useState<
        SessionHistoryResponse['data']
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'history' | 'bookmark'>(
        'history'
    );
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [isBookmarking, setIsBookmarking] = useState<Record<string, boolean>>(
        {}
    );

    useEffect(() => {
        const loadBookmarkedChats = async () => {
            if (activeTab === 'bookmark') {
                try {
                    setIsLoading(true);
                    const response = await chatApi.getBookmarkedChats();
                    setBookmarkedChats(response.data);
                } catch (error) {
                    console.error('Failed to load bookmarked chats:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (isOpen) {
            loadBookmarkedChats();
        }
    }, [isOpen, activeTab]);

    useEffect(() => {
        const loadSessionHistory = async () => {
            try {
                setIsLoading(true);
                const response = await chatApi.getSessionHistory();
                setSessionHistory(response.data);
            } catch (error) {
                console.error('Failed to load session history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            loadSessionHistory();
        }
    }, [isOpen]);

    const filteredSessions = useMemo(() => {
        const filtered = sessionHistory.filter(
            (session) =>
                session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.latest_chat
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        return filtered.sort((a, b) => {
            if (!a.latest_chat_at) return 1;
            if (!b.latest_chat_at) return -1;
            return (
                new Date(b.latest_chat_at).getTime() -
                new Date(a.latest_chat_at).getTime()
            );
        });
    }, [sessionHistory, searchTerm]);

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

    const handleSearch = async (term: string) => {
        setSearchTerm(term);

        if (searchDebounce.current) {
            clearTimeout(searchDebounce.current);
        }

        if (!term.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        searchDebounce.current = setTimeout(async () => {
            try {
                const response = await chatApi.searchChat(term);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const handleNewChat = () => {
        router.push('/copilot');
        onClose();
    };

    const handleCopy = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => {
                setCopiedMessageId(null);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
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

    const handleBookmarkMessage = async (
        messageId: string,
        sessionId: string
    ) => {
        if (isBookmarking[messageId]) return;

        try {
            setIsBookmarking((prev) => ({ ...prev, [messageId]: true }));
            await chatApi.toggleBookmark({
                session_id: sessionId,
                message_id: messageId
            });

            setBookmarkedChats((prev) =>
                prev.filter((chat) => chat.message_id !== messageId)
            );
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        } finally {
            setIsBookmarking((prev) => ({ ...prev, [messageId]: false }));
        }
    };

    const handleDelete = async (sessionId: string) => {
        try {
            await chatApi.deleteSession(sessionId);

            setSessionHistory((prev) =>
                prev.filter((session) => session.id !== sessionId)
            );

            if (router.query.sessionId === sessionId) {
                router.push('/copilot');
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const mobileClasses = isMobile
        ? 'bg-neutral-900 fixed left-0 top-0 bottom-0 w-full transform transition-transform duration-300 ease-in-out'
        : '';
    const mobileTransform = isMobile && !isOpen ? '-translate-x-full' : '';

    return (
        <div
            className={cn(
                'h-full flex flex-col z-50',
                !isMobile && 'transition-all duration-300 ease-in-out',
                !isMobile && (isOpen ? 'w-80 bg-neutral-900' : 'w-20 fixed'),
                mobileClasses,
                mobileTransform
            )}>
            {!isOpen && !isMobile ? (
                <div className="flex flex-row items-center gap-4 px-4 pt-6">
                    <button
                        onClick={onOpen}
                        className="text-white hover:text-neutral-400 transition-colors duration-200">
                        <HiOutlineMenuAlt2 size={24} />
                    </button>
                    <button
                        onClick={handleNewChat}
                        className="text-white hover:text-neutral-400 transition-colors duration-200">
                        <FiEdit size={20} />
                    </button>
                </div>
            ) : (
                <>
                    <div className="shrink-0 p-4 flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="transition-colors duration-200">
                            <IoClose size={24} />
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="p-2 rounded-lg transition-colors duration-200">
                            <FiEdit size={20} />
                        </button>
                    </div>

                    <div className="shrink-0 px-4 mb-4">
                        <div className="flex items-center gap-2 bg-[#222222] px-4 py-2 rounded-full">
                            <BiSearch className="text-neutral-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Cari percakapan"
                                className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full"
                            />
                        </div>
                    </div>

                    <div className="shrink-0 flex border-t border-neutral-800 pt-2 mb-4">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                'flex-1 py-2 text-sm',
                                activeTab === 'history'
                                    ? 'font-bold border-b-2 border-[#5F2BCE]'
                                    : 'text-neutral-400 hover:bg-[#222222]'
                            )}>
                            Riwayat
                        </button>
                        <button
                            onClick={() => setActiveTab('bookmark')}
                            className={cn(
                                'flex-1 py-2 text-sm',
                                activeTab === 'bookmark'
                                    ? 'font-bold border-b-2 border-[#5F2BCE]'
                                    : 'text-neutral-400 hover:bg-[#222222]'
                            )}>
                            Bookmark
                        </button>
                    </div>

                    <div className="flex flex-col min-h-0 flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <AiOutlineLoading3Quarters
                                    className="animate-spin text-neutral-400"
                                    size={24}
                                />
                            </div>
                        ) : isSearching ? (
                            <div className="flex items-center justify-center h-full">
                                <AiOutlineLoading3Quarters
                                    className="animate-spin text-neutral-400"
                                    size={24}
                                />
                            </div>
                        ) : searchTerm ? (
                            <div className="overflow-y-auto px-2 flex-1">
                                {searchResults.map((result) => (
                                    <Link
                                        href={`/copilot/${result.session_id}`}
                                        key={result.message_id}
                                        className="p-3 hover:bg-[#222222] rounded-lg cursor-pointer group block">
                                        <p className="text-sm text-neutral-400 line-clamp-2">
                                            {result.message}
                                        </p>
                                        {result.timestamp && (
                                            <span className="text-xs text-neutral-500 mt-2 block">
                                                {formatTimestamp(
                                                    result.timestamp
                                                )}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : activeTab === 'bookmark' ? (
                            <div className="overflow-y-auto px-2 flex-1">
                                {bookmarkedChats.map((chat) => (
                                    <Link
                                        href={`/copilot/${chat.session_id}`}
                                        key={chat.message_id}
                                        className="p-3 hover:bg-[#222222] rounded-lg cursor-pointer flex flex-row group block">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center">
                                                <CopilotIcon />
                                            </div>
                                        </div>
                                        <div>
                                            <ReactMarkdown
                                                className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                                                remarkPlugins={[
                                                    remarkMath,
                                                    remarkGfm
                                                ]}
                                                rehypePlugins={[rehypeKatex]}>
                                                {chat.message}
                                            </ReactMarkdown>
                                            {chat.timestamp && (
                                                <div className="flex items-center justify-between gap-2 mt-2">
                                                    <span className="text-xs text-neutral-500">
                                                        {formatTimestamp(
                                                            chat.timestamp
                                                        )}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleCopy(
                                                                    chat.message,
                                                                    chat.message_id
                                                                );
                                                            }}
                                                            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors">
                                                            {copiedMessageId ===
                                                            chat.message_id ? (
                                                                <span className="text-sm text-green-500">
                                                                    Copied!
                                                                </span>
                                                            ) : (
                                                                <BiCopy
                                                                    size={20}
                                                                />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleBookmarkMessage(
                                                                    chat.message_id,
                                                                    chat.session_id
                                                                );
                                                            }}
                                                            disabled={
                                                                isBookmarking[
                                                                    chat
                                                                        .message_id
                                                                ]
                                                            }
                                                            className={cn(
                                                                'p-2 rounded-lg transition-colors',
                                                                'bg-[#5F2BCE] text-white',
                                                                isBookmarking[
                                                                    chat
                                                                        .message_id
                                                                ] &&
                                                                    'opacity-50 cursor-not-allowed'
                                                            )}>
                                                            <BsBookmark
                                                                size={16}
                                                                className="fill-current"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : filteredSessions.length > 0 ? (
                            <div className="overflow-y-auto px-2 flex-1">
                                {filteredSessions.map((session) => (
                                    <Link
                                        href={`/copilot/${session.id}`}
                                        key={session.id}
                                        className="group block">
                                        <div className="p-3 hover:bg-[#222222] rounded-lg cursor-pointer">
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
                                                        {formatTimestamp(
                                                            session.latest_chat_at
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span></span>
                                                )}
                                                <SessionMenuDropdown
                                                    sessionId={session.id}
                                                    onRename={handleRename}
                                                    onDelete={handleDelete}
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-neutral-400">
                                    No data found
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
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

export default HistorySection;
