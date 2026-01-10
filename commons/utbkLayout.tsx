import Footer from './components/modules/Footer';
import React from 'react';
import UTBKNavbar from './components/modules/Navbar/utbk';

interface LayoutProps {
    children?: JSX.Element;
    courses: Course[];
}

export default function Layout({
    children,
    courses
}: LayoutProps): JSX.Element {
    return (
        <div className="bg-black">
            <UTBKNavbar courses={courses} />
            {children}
            <Footer className="!bg-black md:mt-7" isUtbk />
        </div>
    );
}
