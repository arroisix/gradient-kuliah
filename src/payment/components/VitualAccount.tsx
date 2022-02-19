import { AiFillBank } from 'react-icons/ai';
import MethodBox from './MethodBox';

const VirtualAccountBox = (): JSX.Element => {
    return (
        <div className="rounded-lg bg-neutral-900 p-8 w-full mt-4 mb-16">
            <div className="mb-4 flex items-center">
                <AiFillBank className="text-base mr-2" />
                <h3 className="text-base font-bold">
                    Transfer Bank via Virtual Account
                </h3>
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

export default VirtualAccountBox;
