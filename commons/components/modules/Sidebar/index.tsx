import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BiBookReader } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';
import {
    RiQuestionnaireLine
    // RiNotification3Line,
    // RiBookOpenLine
} from 'react-icons/ri';

const Sidebar = ({ fullHeight }: { fullHeight?: boolean }): JSX.Element => {
    const route = useRouter();
    const { pathname } = route;

    return (
        <aside
            className={`hidden md:block top-[76px] w-min ${
                fullHeight ? 'fixed h-[90vh]' : 'h-fit sticky'
            } bg-[#121212] rounded-lg w-[158px] px-3 py-4`}>
            <div className="flex flex-col gap-3">
                {/* <Link href={'/notifikasi'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname.includes('/notifikasi')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <RiNotification3Line size={20} />
                        Notifikasi
                    </span>
                </Link> */}
                <Link href={'/dashboard'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname.includes('/dashboard')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <FiHome size={20} />
                        Home
                    </span>
                </Link>
                <Link href={'/komunitas'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname.includes('/komunitas')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <RiQuestionnaireLine size={20} />
                        Komunitas
                    </span>
                </Link>
                <Link href={'/kelas'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname.includes('/kelas')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <BiBookReader size={20} />
                        Kelas
                    </span>
                </Link>
                {/* <Link href={'/buku'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname.includes('/buku')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        } text-[#666666] hover:text-[#999999]`}>
                        <RiBookOpenLine size={20} />
                        Buku
                    </span>
                </Link> */}
            </div>
        </aside>
    );
};

export default Sidebar;
