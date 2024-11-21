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
    onComplete?: (messageId: string, sessionId: string) => void;
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
                            jsonValue.session_id
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

    getChatHistory: async (): Promise<ChatHistoryResponse> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${COPILOT_BASE_URL}chat/history/`, {
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

    changeMessageRating: async (input: ChangeRatingInput): Promise<void> => {
        const token = localStorage.getItem('token');
        await fetch(`${COPILOT_BASE_URL}change_message_rating/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify(input)
        });
    },

    toggleChatBookmark: async (input: ToggleBookmarkInput): Promise<void> => {
        const token = localStorage.getItem('token');
        await fetch(`${COPILOT_BASE_URL}toggle_chat_bookmark/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify(input)
        });
    }
};
