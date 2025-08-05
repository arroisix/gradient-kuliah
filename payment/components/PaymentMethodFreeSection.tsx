import type React from 'react';
import PaymentMethodItem from './PaymentMethodItem';

const PaymentMethodFreeSection: React.FC = () => {
    return (
        <div className="flex flex-col space-y-3 mb-6">
            <h3 className="text-white font-semibold text-base px-4">GRATIS</h3>
            <div className="flex flex-col mx-4 rounded-lg overflow-hidden">
                <PaymentMethodItem
                    key="free"
                    isSelected={true}
                    methodCode="FREE"
                />
            </div>
        </div>
    );
};

export default PaymentMethodFreeSection;
