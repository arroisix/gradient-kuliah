'use client';

import type React from 'react';
import PaymentMethodItem from './PaymentMethodItem';
import { usePayment } from 'payment/contexts/PaymentProvider';

interface PaymentMethodSectionProps {
    section: PaymentMethodSection;
    children?: React.ReactNode;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
    section,
    children
}) => {
    const { paymentMethod } = usePayment();

    return (
        <div className="flex flex-col space-y-3 mb-6">
            <h3 className="text-white font-semibold text-base px-4">
                {section.name}
            </h3>
            <div className="flex flex-col mx-4 rounded-lg overflow-hidden">
                {section.payment_methods
                    .filter(
                        (method) => (method.payment_code as string) !== 'MANUAL'
                    )
                    .map((method, index) => (
                        <PaymentMethodItem
                            key={method.payment_code}
                            method={method}
                            isSelected={paymentMethod === method.payment_code}
                            isLast={
                                index === section.payment_methods.length - 1
                            }
                        />
                    ))}
                {children}
            </div>
        </div>
    );
};

export default PaymentMethodSection;
