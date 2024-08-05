import Button from 'commons/components/elements/Button';
import React from 'react';

const AuthButtons = (): JSX.Element => {
    return (
        <div className="flex gap-2">
            <Button
                variant="custom"
                className="text-sm lg:text-base text-[#B6A6F3]"
                href="/masuk"
                eventName="Login Button on Navbar">
                Masuk
            </Button>
            <Button
                id="signup-on-navbar"
                variant="primary"
                className="text-sm lg:text-base"
                href="/daftar"
                eventName="Register Button on Navbar">
                Daftar
            </Button>
        </div>
    );
};

export default AuthButtons;
