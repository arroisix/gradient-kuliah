import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { CgClose } from 'react-icons/cg';

const OfferNotification = (): JSX.Element => {
    const { checkCustomBreakpoints } = useWindowBreakpoints();

    return (
        <div className="flex justify-between items-center gap-4 py-[0.5rem] px-[1rem] border-[1px] border-accent-purple rounded-lg">
            <span className="text-sm font-extrabold">
                Beli sekali. Akses tanpa batas.
            </span>
            <div className="flex items-center gap-[0.75rem]">
                <Button
                    variant="primary"
                    className="px-[13px] md:px-[2rem] py-[0.5rem] text-xs">
                    {checkCustomBreakpoints(406) ? 'Akses' : 'Akses Kelas'}
                </Button>
                <CgClose
                    size={12}
                    className="text-neutral-600 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default OfferNotification;
