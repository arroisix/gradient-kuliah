import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { subscriptionApi } from 'payment/redux/api/subscriptionApi';
import { useDispatch } from 'react-redux';

const SuccessCheckout = (): JSX.Element => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const timer1 = setTimeout(() => {
            const redirectUrl = (router.query.redirect ||
                localStorage.getItem('redirect')) as string;

            if (!!redirectUrl) {
                const url = new URL(redirectUrl, window.location.href);
                url.searchParams.append('checkout', 'success');
                localStorage.removeItem('redirect');
                router.push(url.toString());
            } else router.push('/dashboard?checkout=success');
            const getActiveSubscription = dispatch(
                subscriptionApi.endpoints.getActiveSubscription.initiate()
            );
            getActiveSubscription.refetch();
        }, 5000);
        return () => {
            clearTimeout(timer1);
        };
    }, []);

    return (
        <Layout>
            <section className="min-h-[75vh] pt-24 px-[7.5rem] flex justify-center items-center flex-col">
                <div className="w-[165px] h-[134px] mb-2 relative">
                    <Image
                        src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/success_payment.png"
                        layout="fill"
                    />
                </div>
                <h5 className="text-2xl font-bold">Pembayaran berhasil!</h5>
                <span className="text-base text-neutral-400">
                    Kamu akan diarahkan ke halaman kelasmu dalam 5 detik...
                </span>
            </section>
        </Layout>
    );
};

SuccessCheckout.displayName = 'Success Checkout';
export default withAuth(SuccessCheckout);
