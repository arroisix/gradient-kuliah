import type React from 'react';
import PaymentMethodSectionComponent from './PaymentMethodSectionComponent';
import Spinner from 'commons/components/elements/Spinner';
import { useGetAllPaymentMethodsQuery } from 'payment/redux/api/transactionApi';
import { useEffect, useRef } from 'react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import FreeBox from './FreeBox';
import PaymentMethodOtherItem from './PaymentMethodOtherItem';
import OtherPaymentBox from './OtherPayment';

const PaymentMethodList: React.FC = () => {
    const otherPaymentMethodRef = useRef<HTMLDivElement>(null);
    const { packet } = usePayment();
    const {
        data: paymentMethods,
        isLoading: paymentMethodsLoading,
        error: paymentMethodsError
    } = useGetAllPaymentMethodsQuery();

    useEffect(() => {
        localStorage.removeItem('packetId');
    }, []);

    const scrollToOtherPayment = (): void => {
        const offset = 150;
        const elementPosition =
            otherPaymentMethodRef.current?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    if (paymentMethodsLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner size="medium" />
            </div>
        );
    }

    if (paymentMethodsError) {
        return (
            <div className="text-center py-8 text-red-400">
                Failed to load payment methods
            </div>
        );
    }

    if (!paymentMethods?.data) {
        return (
            <div className="text-center py-8 text-gray-400">
                No payment methods available
            </div>
        );
    }

    // Sort sections by order
    const sortedSections = [...paymentMethods.data]
        .sort((a, b) => a.order - b.order)
        .filter((section) => section.key !== 'retail');

    return (
        <div className="flex-1 overflow-y-auto pb-32 mx-32">
            <div className="pt-24">
                {packet?.is_free ? (
                    <FreeBox />
                ) : (
                    <>
                        {sortedSections.map((section) => (
                            <PaymentMethodSectionComponent
                                key={section.key}
                                section={section}>
                                {section.key === 'va' && (
                                    <PaymentMethodOtherItem
                                        onClick={scrollToOtherPayment}
                                    />
                                )}
                            </PaymentMethodSectionComponent>
                        ))}
                        <OtherPaymentBox ref={otherPaymentMethodRef} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodList;
