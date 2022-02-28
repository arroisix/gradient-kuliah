import moment from 'moment';

export const checkExpiry = (expiryDate: string): boolean => {
    const now = moment();
    const expiry = moment(expiryDate);

    if (now.isBefore(expiry)) {
        return false;
    }

    return true;
};
