import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import { useGetCommunityNotificationQuery } from 'komunitas/redux/api/komunitasApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { posthog } from 'posthog-js';
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

    const { data: configData } = useGetConfigQuery();
    const { data: communityNotification } = useGetCommunityNotificationQuery();

    return (
        <aside
            className={`hidden md:block top-[76px] w-min ${
                fullHeight ? 'fixed h-[90vh]' : 'h-fit sticky'
            } bg-[#121212] rounded-lg w-[175px] px-3 py-4`}>
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
                {configData?.configs.is_community_config_enabled && (
                    <span
                        className={`flex items-center gap-4 cursor-pointer ${
                            pathname.includes('/komunitas')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}
                        onClick={() => {
                            posthog.capture('Visit Community Explore Page', {
                                description: 'User visit Community Page'
                            });
                            route.push('/komunitas');
                        }}
                        aria-hidden>
                        <RiQuestionnaireLine size={20} />
                        Komunitas
                        {communityNotification?.unseen_comment_counts ? (
                            <span className="inline-block leading-none h-min py-[2px] pl-[3px] pr-[4px] font-body text-center text-white text-[10px] bg-[#B92011] rounded-full">
                                {communityNotification?.unseen_comment_counts}
                            </span>
                        ) : (
                            <span className="inline-block leading-none h-min py-[2px] pl-[3px] pr-[4px] font-body text-center text-white text-[10px] bg-[#B92011] rounded-full animate-pulse">
                                new
                            </span>
                        )}
                    </span>
                )}
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
