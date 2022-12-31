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
    const name = target;
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    const initials = [...name.matchAll(rgx)] || [];

    const result = (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();

    return result.toString();
};
