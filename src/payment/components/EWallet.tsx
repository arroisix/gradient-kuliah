import { BsFillWalletFill } from 'react-icons/bs';
import MethodBox from './MethodBox';

const EwalletBox = (): JSX.Element => {
    return (
        <div className="rounded-lg bg-neutral-900 p-8 w-full mt-16 mb-4">
            <div className="mb-4 flex items-center">
                <BsFillWalletFill className="text-base mr-2" />
                <h3 className="text-base font-bold">E-Wallet</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <MethodBox />
                <MethodBox />
                <MethodBox />
                <MethodBox />
                <MethodBox />
                <MethodBox />
                <MethodBox />
            </div>
        </div>
    );
};

export default EwalletBox;
