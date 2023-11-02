import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SuccessCheckout = (): JSX.Element => {
    const router = useRouter();
    useEffect(() => {
        const timer1 = setTimeout(
            () => router.push('/dashboard?checkout=success'),
            5000
        );
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
