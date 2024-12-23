import Layout from 'commons/layout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useEmailActivationMutation } from 'authentication/redux/api/authApi';
import Spinner from 'commons/components/elements/Spinner';

const EmailActivation = (): JSX.Element => {
    const router = useRouter();
    const { token } = router.query;
    const [verifyToken, { isLoading, data }] = useEmailActivationMutation();

    const tokenVerification = async (tkn: string): Promise<void> => {
        await verifyToken(tkn);
    };

    useEffect(() => {
        if (token) {
            tokenVerification(token as string);
        }
    }, [token]);

    return (
        <Layout>
            <section className="min-h-[75vh] pt-24 px-[7.5rem] flex justify-center items-center flex-col gap-4">
                <h5 className="text-2xl font-bold">Aktivasi Akun</h5>
                {isLoading && <Spinner size="medium" />}
                {data && (
                    <span className="text-base">
                        {data.is_valid
                            ? 'Aktivasi berhasil, silahkan kembali beraktivitas'
                            : data.message}
                    </span>
                )}
            </section>
        </Layout>
    );
};

EmailActivation.displayName = 'Email Activation';
export default EmailActivation;
