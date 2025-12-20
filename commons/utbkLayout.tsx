import Link from 'next/link';
import Footer from './components/modules/Footer';
import { CDN_URL } from './constants';

interface LayoutProps {
    children?: JSX.Element;
}

function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <div className="bg-black">
            <Navbar />
            {children}
            <Footer className="!bg-black" />
        </div>
    );
}

function Navbar(): JSX.Element {
    return (
        <header className="flex fixed top-0 z-50 w-full justify-center lg:mt-[10px]">
            <div className="flex justify-between items-center w-full px-8 bg-white bg-opacity-[3%] border-solid border-[1px] border-white border-opacity-[8%] rounded-full h-[60px] m-4 max-w-[1232px]">
                <Link
                    href="/utbk"
                    className="text-2xl leading-6 tracking-[0.08px] font-bold font-[Urbanist] text-[#E9E9E9]">
                    Gradient
                </Link>

                <section className="hidden"></section>

                <button>
                    <img
                        src={`${CDN_URL}/assets/utbk/hamburger.svg`}
                        alt="Menu"
                        height={24}
                        width={24}
                    />
                </button>
            </div>
        </header>
    );
}

export default Layout;
