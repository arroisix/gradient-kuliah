import Footer from './components/modules/Footer';

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
    return <header></header>;
}

export default Layout;
