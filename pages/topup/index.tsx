import Layout from 'commons/layout';
import PaymentMethodList from 'payment/components/PaymentList/PaymentMethodList';
import { PromoCodeModal } from 'payment/components/Promo/PromoCodeModal';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';
import { useState } from 'react';
import TopupInfo from 'payment/components/TopupInfo';
import CheckoutTopupBottomSheet from 'payment/components/CheckoutTopupBottomSheet';

const Topup = () => {
    const [isPromoModalOpen, setPromoModalOpen] = useState(false);

    return (
        <Layout paymentPage isFullBlackBackground>
            <PaymentProvider>
                <TopupInfo />
                <PaymentMethodList isForTopup />
                <CheckoutTopupBottomSheet
                    onPromoClick={() => setPromoModalOpen(true)}
                />
                <PromoCodeModal
                    isOpen={isPromoModalOpen}
                    setOpen={setPromoModalOpen}
                />
            </PaymentProvider>
        </Layout>
    );
};

export default Topup;
