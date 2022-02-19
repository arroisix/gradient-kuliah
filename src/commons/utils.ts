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
