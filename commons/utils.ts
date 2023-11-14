import { isValidElement, Children } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

    return formatter.format(+amount);
};

export const generateInitial = (target: string): string => {
    const name = target ?? '';
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    const initials = [...name.matchAll(rgx)] || [];

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
