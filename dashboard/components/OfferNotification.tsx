import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Link from 'next/link';

const OfferNotification = (): JSX.Element => {
    const { checkCustomBreakpoints } = useWindowBreakpoints();

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg border-px border-accent-purple">
            <span className="text-sm font-extrabold">
                Beli sekali. Akses tanpa batas.
            </span>
            <div className="flex items-center gap-[0.75rem]">
                <Link href={'/langganan'}>
                    <Button
                        variant="primary"
                        className="px-[13px] md:px-[2rem] py-[0.5rem] text-xs">
                        {checkCustomBreakpoints(406) ? 'Akses' : 'Akses Kelas'}
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OfferNotification;
