import Footer from './components/modules/Footer';
import React from 'react';
import UTBKNavbar from './components/modules/Navbar/utbk';

interface LayoutProps {
    children?: JSX.Element;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <div className="bg-black">
            <UTBKNavbar />
            {children}
            <Footer className="!bg-black md:mt-7" isUtbk />
        </div>
    );
}
