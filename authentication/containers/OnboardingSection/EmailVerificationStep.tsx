import { useEmailVerification } from 'authentication/hooks/useEmailVerification';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import { CDN_URL } from 'commons/constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const EmailVerificationStep = (): JSX.Element => {
    const router = useRouter();
    const { email } = useGetProfileQuery(
        {},
        { selectFromResult: ({ data }) => ({ email: data?.email ?? '' }) }
    );

    const { countdown, canResend, handleResend, isLoadingResend } =
        useEmailVerification({
            countdownValue: 30,
            onEmailVerified() {
                router.push({
                    pathname: '/onboarding/jenis-akun',
                    query: router.query
                });
                localStorage.removeItem('showEmailVerification');
            }
        });

    const { data: profile } = useGetProfileQuery({});

    useEffect(() => {
        if (profile && !profile.is_email_verified) {
            handleResend();
        }
    }, []);

    return (
        <section className="flex flex-col text-center gap-6 max-w-[393px] px-4">
            <img
                src={`${CDN_URL}/assets/submit_latihan.svg`}
                alt="Verifikasi email"
                height={120}
                width={120}
                className="self-center"
            />
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold">Verifikasi email</h3>
                <p className="text-sm text-graphite-400 leading-[22px]">
                    Demi keamanan akun, klik link verifikasi yang kami kirim ke{' '}
                    <span className="font-semibold">{email}</span>
                </p>
            </div>
            <div className="flex flex-col">
                {canResend ? (
                    <Button
                        onClick={handleResend}
                        variant="tertiary"
                        className="mb-2 h-[46px]"
                        disabled={isLoadingResend}>
                        {isLoadingResend ? (
                            <Spinner size="small" />
                        ) : (
                            'Kirim Ulang'
                        )}
                    </Button>
                ) : (
                    <p className="mb-6 text-graphite-400 text-base">
                        <span className="text-white font-semibold">
                            {countdown} detik
                        </span>{' '}
                        sebelum mengirim ulang
                    </p>
                )}
                <Button
                    variant="primary"
                    className="h-[46px]"
                    onClick={() =>
                        window.open('https://mail.google.com', '_blank')
                    }>
                    Periksa Inbox
                </Button>
            </div>
        </section>
    );
};
