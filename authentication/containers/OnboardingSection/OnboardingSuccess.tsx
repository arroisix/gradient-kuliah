import Button from 'commons/components/elements/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const OnboardingSuccess = (): JSX.Element => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="font-sans text-4xl font-extrabold">
                Selamat Datang di{' '}
                <span className=" font-[Urbanist]">Gradient</span>
            </h1>

            <Link
                href={
                    !!router.query.redirect
                        ? `${router.query.redirect}`
                        : '/kelas'
                }>
                <Button variant="primary" className="w-1/2">
                    Mulai Sekarang
                </Button>
            </Link>
        </div>
    );
};
