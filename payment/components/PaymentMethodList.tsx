import type React from 'react';
import PaymentMethodSectionComponent from './PaymentMethodSectionComponent';
import Spinner from 'commons/components/elements/Spinner';
import { useGetAllPaymentMethodsQuery } from 'payment/redux/api/transactionApi';
import { useEffect } from 'react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import PaymentMethodCardSection from './PaymentMethodCardSection';
import PaymentMethodFreeSection from './PaymentMethodFreeSection';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';

const PaymentMethodList: React.FC = () => {
    const { packet } = usePayment();
    const {
        data: paymentMethods,
        isLoading: paymentMethodsLoading,
        error: paymentMethodsError
    } = useGetAllPaymentMethodsQuery();
    const { data: configData } = useGetConfigQuery();

    useEffect(() => {
        localStorage.removeItem('packetId');
    }, []);

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
        <div className="flex flex-col overflow-y-auto pb-44 md:pb-36 mx-4 sm:mx-8 md:mx-32">
            <div className="pt-28">
                {packet?.is_free ? (
                    <PaymentMethodFreeSection />
                ) : (
                    <>
                        {sortedSections.map((section) => {
                            if (section.key === 'card') {
                                if (
                                    configData?.configs
                                        .is_credit_card_config_enabled
                                ) {
                                    return (
                                        <PaymentMethodCardSection
                                            key={section.key}
                                        />
                                    );
                                } else {
                                    return <></>;
                                }
                            } else {
                                return (
                                    <PaymentMethodSectionComponent
                                        key={section.key}
                                        section={section}
                                    />
                                );
                            }
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodList;
