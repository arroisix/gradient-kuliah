import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import React from 'react';
import { sanitizeUrl } from 'commons/utils';

const AuthButtons = (): JSX.Element => {
    const router = useRouter();
    return (
        <div className="flex gap-2">
            <Button
                variant="custom"
                className="text-sm lg:text-base text-[#B6A6F3]"
                href={`/masuk?redirect=${sanitizeUrl(router.asPath)}`}
                eventName="Login Button on Navbar">
                Masuk
            </Button>
            <Button
                id="signup-on-navbar"
                variant="primary"
                className="text-sm lg:text-base"
                href={`/daftar?redirect=${sanitizeUrl(router.asPath)}`}
                eventName="Register Button on Navbar">
                Daftar
            </Button>
        </div>
    );
};

export default AuthButtons;
