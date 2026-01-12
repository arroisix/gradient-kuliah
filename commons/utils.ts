import { isValidElement, Children } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export const renderName = (email: string, fullName: string): string => {
    if (fullName === '') {
        return email?.split('@')[0];
    }

    return fullName?.split(' ')[0];
};

export const formatCurrency = (amount: string): string => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
    return formatter.format(+amount).replace(/\s/g, '');
};

export const generateInitial = (target: string): string => {
    const name = target ?? '';
    const rgx = /(\p{L}{1})\p{L}+/gu;

    const initials = [...name.matchAll(rgx)];

    const result = (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();

    return result.toString();
};

export const makeid = (length: number): string => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

export const capitalize = (sentence: string): string => {
    if (!sentence) return sentence;
    const words = sentence.split(' ');

    const capitalizeWords = words.map(
        (word) => word[0].toUpperCase() + word.substring(1).toLowerCase()
    );

    return capitalizeWords.join(' ');
};

export const isNotNullAndUndefined = <T>(data: T): boolean => {
    return data !== undefined && data !== null;
};

// Taken from
// https://github.com/fernandopasik/react-children-utilities/blob/main/src/lib/onlyText.ts
// https://github.com/fernandopasik/react-children-utilities/blob/main/src/lib/hasChildren.ts

const hasChildren = (
    element: React.ReactNode
): element is React.ReactElement<{
    children: React.ReactNode | React.ReactNode[];
}> =>
    isValidElement<{ children?: React.ReactNode[] }>(element) &&
    Boolean(element.props.children);

const childToString = (child?: React.ReactNode): string => {
    if (
        typeof child === 'undefined' ||
        child === null ||
        typeof child === 'boolean'
    ) {
        return '';
    }

    if (JSON.stringify(child) === '{}') {
        return '';
    }

    return (child as number | string).toString();
};

export const onlyText = (
    children: React.ReactNode | React.ReactNode[]
): string => {
    if (!(children instanceof Array) && !isValidElement(children)) {
        return childToString(children);
    }

    return Children.toArray(children).reduce(
        (text: string, child: React.ReactNode): string => {
            let newText = '';

            if (isValidElement(child) && hasChildren(child)) {
                newText = onlyText(child.props.children);
            } else if (isValidElement(child) && !hasChildren(child)) {
                newText = '';
            } else {
                newText = childToString(child);
            }

            return text.concat(newText);
        },
        ''
    );
};

export function getDisplayName<P extends object>(
    WrappedComponent: React.ComponentType<P>
): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Taken from https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
export const getCookieValue = (name: string): string =>
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

export const slugify = (str: string): string =>
    str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

export const queryParamBuilder = (
    params: string | string[][] | Record<string, string> | URLSearchParams
): string => {
    // Create a new object with only non-empty properties
    const params_ = Object.fromEntries(
        Object.entries(params).filter((entry) => !!entry[1] || entry[1] === 0)
    );
    const searchParam = new URLSearchParams(params_);
    return searchParam.toString();
};

export const addZeroBefore = (data: number): string => {
    return `${data < 10 ? '0' : ''}${data}`;
};

export const getCSChatRoom = (
    method: 'WA' | 'LINE' | 'IG',
    msg?: string
): string => {
    const currentDate = new Date();

    if (method === 'WA') {
        if (msg) {
            return `https://api.whatsapp.com/send?phone=6285179893859&text=${msg}`;
        }

        return `https://api.whatsapp.com/send?phone=6285179765182&text=${encodeURIComponent(
            `Halo, Saya tertarik untuk berlangganan\n\n[ID:${currentDate.getDate()}${addZeroBefore(
                currentDate.getMonth() + 1
            )}${currentDate.getFullYear()}]`
        )}`;
    } else if (method === 'LINE') {
        return 'https://lin.ee/43ORGst';
    }

    return 'https://ig.me/m/gradient_idn';
};

export function checkVisible(elm: Element): boolean {
    const rect = elm.getBoundingClientRect();
    const viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
    );
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export const formatDuration = (durationString?: string | null): string => {
    if (!durationString) return '00:00';
    const duration = moment.duration(durationString);
    const [seconds, minutes, hours] = [
        duration.get('second'),
        duration.get('minute'),
        duration.get('hour')
    ];

    const displayHours = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${displayHours}${formattedMinutes}:${formattedSeconds}`;
};

export function transcriptTimeToSeconds(time: string): number {
    if (!time) {
        return 0;
    }

    const duration = moment.duration(time);
    const hours = duration.get('hour');
    const minutes = duration.get('minute');
    const seconds = duration.get('second');
    return hours * 60 * 60 + minutes * 60 + seconds;
}

export const isAlphaNumeric = (str: string, includeSpace: boolean): boolean => {
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        const isDigit = code >= 48 && code <= 57; // 0–9
        const isUpper = code >= 65 && code <= 90; // A–Z
        const isLower = code >= 97 && code <= 122; // a–z
        const isSpace = includeSpace && code === 32; // space
        if (!(isDigit || isUpper || isLower || isSpace)) {
            return false;
        }
    }
    return true;
};

export const sanitizeUrl = (url: string): string => {
    try {
        // Decode URL to prevent encoded bypasses
        const decodedUrl = decodeURIComponent(url).trim().toLowerCase();

        // Block all dangerous protocols
        const dangerousProtocols = [
            'javascript:',
            'data:',
            'vbscript:',
            'file:',
            'about:',
            'chrome:',
            'chrome-extension:',
            'moz-extension:',
            'ms-appx:',
            'ms-appx-web:',
            'blob:'
        ];

        // Check if URL starts with any dangerous protocol
        for (const protocol of dangerousProtocols) {
            if (decodedUrl.startsWith(protocol)) {
                return '/';
            }
        }

        // Only allow relative URLs starting with /
        if (url.startsWith('/')) {
            // Validate relative URL format (no dangerous characters)
            if (/^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/.test(url)) {
                return url;
            }
            return '/';
        }

        // For absolute URLs, validate they're same origin
        if (typeof window !== 'undefined') {
            try {
                const urlObj = new URL(url, window.location.origin);
                if (urlObj.origin === window.location.origin) {
                    return urlObj.pathname + urlObj.search + urlObj.hash;
                } else {
                    // Show warning for external URLs
                    const confirmed = window.confirm(
                        `Anda akan diarahkan ke website: ${urlObj.origin}\n\n` +
                            `Kami tidak dapat menjamin keamanan website tersebut. ` +
                            `Pastikan Anda berhati-hati saat mengakses link eksternal.\n\n` +
                            `Apakah Anda yakin ingin melanjutkan?`
                    );

                    if (confirmed) {
                        // Open in new tab for security
                        return url;
                    }

                    // Always return internal path regardless of user choice
                    return '/';
                }
            } catch {
                return '/';
            }
        }

        return '/';
    } catch {
        return '/';
    }
};
