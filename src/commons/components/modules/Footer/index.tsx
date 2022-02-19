import { MdCopyright } from 'react-icons/md';

const Footer = (): JSX.Element => {
    return (
        <footer
            className={`w-full h-[300px] flex justify-center items-center bg-[#121212]`}>
            <span className="text-accent-violet mr-1">Gradient Academy</span>
            <MdCopyright className="text-accent-violet" />
            <span className="text-accent-violet ml-1">2022</span>
        </footer>
    );
};

export default Footer;
