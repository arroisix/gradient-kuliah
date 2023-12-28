import moment, { type Moment } from 'moment';
import React from 'react';

type SubscriptionDateProps = {
    transaction: Transaction;
};

const SubscriptionDate = ({
    transaction
}: SubscriptionDateProps): JSX.Element => {
    const startDate = moment(
        transaction.subscriber.active_from || transaction.created_at
    );
    const endDate =
        moment(transaction.subscriber.deactivate_after) ||
        startDate.add(
            transaction.subscriber.subscribed_packet.active_duration,
            'day'
        );
    const formatDate = (date: Moment): string => {
        return moment(date).utc().format('D MMM YYYY');
    };

    return (
        <p className="text-xs font-body md:text-sm">
            {formatDate(startDate)} hingga {formatDate(endDate)}
        </p>
    );
};

export default SubscriptionDate;
