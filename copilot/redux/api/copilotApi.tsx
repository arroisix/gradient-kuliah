import {
    ChatInput,
    ChatHistoryResponse,
    ChangeRatingInput,
    ToggleBookmarkInput
} from '../../types/copilot';
import config from '../../../redux/api/config';

const BASE_URL = config.API_BASE_URL;
const COPILOT_BASE_URL = `${BASE_URL}copilots/`;

interface StreamCallbacks {
    onContent?: (content: string) => void;
    onComplete?: (
        messageId: string,
        sessionId: string,
        sessionName: string | null,
        keyword: string | null
    ) => void;
    onError?: (error: any) => void;
}

async function processStream(
    reader: ReadableStreamDefaultReader<string>,
    callbacks: StreamCallbacks
) {
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        const parts = buffer.split('\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
            if (part.trim()) {
                try {
                    const jsonValue = JSON.parse(part);
                    if (jsonValue.type === 'CONTENT' && jsonValue.content) {
                        callbacks.onContent?.(jsonValue.content);
                    } else if (jsonValue.type === 'INFO') {
                        callbacks.onComplete?.(
                            jsonValue.message_id,
                            jsonValue.session_id,
                            jsonValue.session_name,
                            jsonValue.keyword
                        );
                    }
                } catch (err) {
                    callbacks.onError?.(err);
                    console.error('Error parsing JSON:', err);
                }
            }
        }
    }
}

export const chatApi = {
    chat: async (input: ChatInput, callbacks: StreamCallbacks) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${COPILOT_BASE_URL}chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body
                ?.pipeThrough(new TextDecoderStream())
                .getReader();

            if (reader) {
                await processStream(reader, callbacks);
            }
        } catch (error) {
            callbacks.onError?.(error);
            console.error('Chat error:', error);
        }
    },

    chatSingle: async (input: ChatInput, callbacks: StreamCallbacks) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${COPILOT_BASE_URL}chat/single/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body
                ?.pipeThrough(new TextDecoderStream())
                .getReader();

            if (reader) {
                await processStream(reader, callbacks);
            }
        } catch (error) {
            callbacks.onError?.(error);
            console.error('Chat error:', error);
        }
    },

    getChatHistory: async (
        sessionId?: string
    ): Promise<ChatHistoryResponse> => {
        const token = localStorage.getItem('token');
        const url = sessionId
            ? `${COPILOT_BASE_URL}chat/history/${sessionId}/`
            : `${COPILOT_BASE_URL}chat/history/single/`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getChatHistorySingle: async (): Promise<ChatHistoryResponse> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}chat/history/single/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    changeMessageRating: async (
        input: ChangeRatingInput
    ): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}change-message-rating/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    toggleBookmark: async (
        input: ToggleBookmarkInput
    ): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}toggle-chat-bookmark/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                },
                body: JSON.stringify(input)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getBookmarkedChats: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}chat/bookmarked/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getSessionHistory: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}session/history/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    renameSession: async (input: {
        session_id: string;
        name: string;
    }): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}session/rename/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
                Accept: '*/*'
            },
            body: JSON.stringify(input)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    deleteSession: async (sessionId: string): Promise<{ message: string }> => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}session/${sessionId}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    searchChat: async (keyword: string, type = 'all', page = 1, limit = 10) => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${COPILOT_BASE_URL}chat/search/?keyword=${encodeURIComponent(
                keyword
            )}&type=${type}&page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
};
