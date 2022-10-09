import moment from 'moment';

export const checkExpiry = (expiryDate: string): boolean => {
    const now = moment();
    const expiry = moment(expiryDate);

    if (now.isBefore(expiry)) {
        return false;
    }

    return true;
};

export const countTheDay = (time: string): number => {
    const targetTime = moment(time);
    const now = moment();
    const countByDay = targetTime.diff(now, 'days');

    return countByDay;
};
