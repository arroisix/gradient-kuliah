import { isValidElement, ReactNode, ReactElement, Children } from 'react';
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
    element: ReactNode
): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
    isValidElement<{ children?: ReactNode[] }>(element) &&
    Boolean(element.props.children);

const childToString = (child?: ReactNode): string => {
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

export const onlyText = (children: ReactNode | ReactNode[]): string => {
    if (!(children instanceof Array) && !isValidElement(children)) {
        return childToString(children);
    }

    return Children.toArray(children).reduce(
        (text: string, child: ReactNode): string => {
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
