import Link from 'next/link';
import { MdHistory, MdLogout, MdOutlineBook } from 'react-icons/md';
import { removeUser } from 'authentication/redux/slices/userSlice';
import { useDispatch } from 'react-redux';

interface MobileNavbarProps {
    closeMobile: (status: boolean) => void;
}

const MobileNavbar = ({ closeMobile }: MobileNavbarProps): JSX.Element => {
    const dispatch = useDispatch();

    return (
        <>
            <div
                className={`w-full p-4 bg-[#171717] flex justify-between md:hidden`}>
                <div className="w-full">
                    <div className="w-full">
                        <div className="pb-4">
                            <Link href={'/transaksi'}>
                                <div className="flex text-white hover:text-accent-blue font-normal w-full items-center mb-4">
                                    <div>
                                        <MdHistory className="text-2xl" />
                                    </div>
                                    <div className="w-full ml-4">
                                        <p className="text-base">
                                            Riwayat Pembelian
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <Link href={'/kelas/?flag=kelasku'}>
                                <div className="flex text-white hover:text-accent-blue  font-normal w-full items-center mb-4">
                                    <div>
                                        <MdOutlineBook className="text-2xl" />
                                    </div>
                                    <div className="w-full ml-4">
                                        <p className="text-base">Kelasku</p>
                                    </div>
                                </div>
                            </Link>
                            <div
                                className="flex text-accent-orange hover:text-state-error font-normal w-full items-center mb-4"
                                onClick={() => dispatch(removeUser())}
                                aria-hidden>
                                <div>
                                    <MdLogout className="text-2xl" />
                                </div>
                                <div className="w-full ml-4">
                                    <p className="text-base">Logout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                aria-hidden
                className="w-screen h-screen absolute bg-black opacity-30"
                onClick={() => closeMobile(false)}></div>
        </>
    );
};

export default MobileNavbar;
