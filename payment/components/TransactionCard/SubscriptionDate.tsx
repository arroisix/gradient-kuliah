import moment, { type Moment } from 'moment';
import React from 'react';

type SubscriptionDateProps = {
    transaction: Transaction;
};

const SubscriptionDate = ({
    transaction
}: SubscriptionDateProps): JSX.Element => {
    const { created_at: transactionDate, subscriber } = transaction;
    const {
        active_from: subscriptionStart,
        deactivate_after: subscriptionEnd,
        subscribed_packet: subscriptionPackage
    } = subscriber;
    const startDate = moment(subscriptionStart || transactionDate);
    const endDate = subscriptionEnd
        ? moment(subscriptionEnd)
        : startDate.clone().add(subscriptionPackage.active_duration, 'day');
    const formatDate = (date: Moment): string => {
        return moment(date).utc(true).format('D MMM YYYY');
    };

    return (
        <p className="text-xs font-body md:text-sm">
            {formatDate(startDate)} hingga {formatDate(endDate)}
        </p>
    );
};

export default SubscriptionDate;
