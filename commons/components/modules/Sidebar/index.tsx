import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import CopilotIconLine from 'copilot/assets/CopilotIconLine';
import BookStackIcon from '../../elements/Icons/BookStack';
import KelasIcon from '../../elements/Icons/Kelas';
import PencilOnLineIcon from '../../elements/Icons/PencilLine';
import HomeIcon from '../../elements/Icons/Home';
import { useAuth } from 'authentication/contexts/AuthProvider';
import GraduationCapIcon from 'commons/components/elements/Icons/GraduationCap';
import { TargetKampusIcon } from 'commons/components/elements/Icons/TargetKampusIcon';
import RoleSwitcher from '../Navbar/RoleSwitcher';

const Sidebar = ({
    fullHeight,
    className
}: {
    fullHeight?: boolean;
    className?: string;
}): JSX.Element => {
    const route = useRouter();
    const { pathname } = route;
    const { profile } = useAuth();

    const { data: configData } = useGetConfigQuery();
    const tracker = useTracker();

    const renderMenuItem = (): JSX.Element => {
        if (profile?.current_role === 'K12') {
            return (
                <>
                    <Link
                        href={'/utbk/dashboard'}
                        onClick={() => {
                            tracker?.genericTrack(
                                `Click Home ${
                                    !fullHeight ? 'Course ' : ''
                                }Navigation`
                            );
                        }}>
                        <span
                            className={`flex gap-3 cursor-pointer ${
                                pathname.includes('/utbk/dashboard')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            } font-body text-sm hover:text-[#999999]`}>
                            <HomeIcon
                                className="w-5 h-5"
                                fill={
                                    pathname.includes('/utbk/dashboard')
                                        ? 'white'
                                        : 'none'
                                }
                            />
                            Home
                        </span>
                    </Link>

                    <Link
                        href={'/utbk/materi'}
                        onClick={() => {
                            tracker?.genericTrack(
                                `Click Class ${
                                    !fullHeight ? 'Course ' : ''
                                }Navigation`
                            );
                        }}>
                        <span
                            className={`flex items-center gap-3 cursor-pointer ${
                                pathname.includes('/utbk/materi')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            } font-body text-sm hover:text-[#999999]`}>
                            <KelasIcon
                                size={20}
                                fill={
                                    pathname.includes('/utbk/materi')
                                        ? 'white'
                                        : 'none'
                                }
                            />
                            Materi{' '}
                            <div className="font-bold text-[10px] leading-normal py-1 px-2 bg-[#20222E] rounded-lg">
                                COMING SOON
                            </div>
                        </span>
                    </Link>

                    {configData?.configs.is_exercise_config_enabled && (
                        <Link
                            href={'/utbk/try-out'}
                            onClick={() => {
                                tracker?.genericTrack(
                                    `Click Exercises ${
                                        !fullHeight ? 'Course ' : ''
                                    }Navigation`
                                );
                            }}>
                            <span
                                className={cn(
                                    'flex gap-3 cursor-pointer font-body text-sm hover:text-[#999999]',
                                    pathname.includes('/utbk/try-out')
                                        ? 'text-white'
                                        : 'text-[#666666]'
                                )}>
                                <PencilOnLineIcon
                                    size={20}
                                    fill={
                                        pathname.includes('/utbk/try-out')
                                            ? 'white'
                                            : 'none'
                                    }
                                />
                                Try Out
                            </span>
                        </Link>
                    )}

                    <Link
                        href={'/utbk/prediksi-ptn'}
                        onClick={() => {
                            tracker?.genericTrack(
                                `Click Prediksi PTN ${
                                    !fullHeight ? 'Course ' : ''
                                }Navigation`
                            );
                        }}>
                        <span
                            className={`flex items-center gap-3 cursor-pointer ${
                                pathname.includes('/prediksi-ptn')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            } font-body text-sm hover:text-[#999999]`}>
                            {pathname.includes('/prediksi-ptn') ? (
                                <TargetKampusIcon className="fill-white h-5 w-5" />
                            ) : (
                                <GraduationCapIcon size={20} />
                            )}
                            Prediksi PTN{' '}
                        </span>
                    </Link>
                </>
            );
        } else {
            return (
                <>
                    <Link
                        href={'/dashboard'}
                        onClick={() => {
                            tracker?.genericTrack(
                                `Click Home ${
                                    !fullHeight ? 'Course ' : ''
                                }Navigation`
                            );
                        }}>
                        <span
                            className={`flex gap-4 cursor-pointer ${
                                pathname.includes('/dashboard')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            } font-body text-sm hover:text-[#999999]`}>
                            <HomeIcon
                                className="w-5 h-5"
                                fill={
                                    pathname.includes('/dashboard')
                                        ? 'white'
                                        : 'none'
                                }
                            />
                            Home
                        </span>
                    </Link>
                    <Link
                        href={'/kelas'}
                        onClick={() => {
                            tracker?.genericTrack(
                                `Click Class ${
                                    !fullHeight ? 'Course ' : ''
                                }Navigation`
                            );
                        }}>
                        <span
                            className={`flex gap-4 cursor-pointer ${
                                pathname.includes('/kelas')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            } font-body text-sm hover:text-[#999999]`}>
                            <KelasIcon
                                size={20}
                                fill={
                                    pathname.includes('/kelas')
                                        ? 'white'
                                        : 'none'
                                }
                            />
                            Kelas
                        </span>
                    </Link>
                    {configData?.configs.is_exercise_config_enabled && (
                        <Link
                            href={'/latihan'}
                            onClick={() => {
                                tracker?.genericTrack(
                                    `Click Exercises ${
                                        !fullHeight ? 'Course ' : ''
                                    }Navigation`
                                );
                            }}>
                            <span
                                className={cn(
                                    'flex gap-4 cursor-pointer  font-body text-sm hover:text-[#999999]',
                                    pathname.includes('/latihan')
                                        ? 'text-white'
                                        : 'text-[#666666]'
                                )}>
                                <PencilOnLineIcon
                                    size={20}
                                    fill={
                                        pathname.includes('/latihan')
                                            ? 'white'
                                            : 'none'
                                    }
                                />
                                Try Out
                            </span>
                        </Link>
                    )}
                    {configData?.configs.is_copilot_config_enabled && (
                        <Link
                            href={'/copilot'}
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click Copilot Sidebar Navigation'
                                );
                            }}>
                            <span
                                className={`flex gap-4 cursor-pointer ${
                                    pathname.includes('/copilot')
                                        ? 'text-white'
                                        : 'text-[#666666]'
                                } font-body text-sm hover:text-[#999999]`}>
                                <CopilotIconLine
                                    fill={
                                        pathname.includes('/copilot')
                                            ? 'white'
                                            : 'none'
                                    }
                                />
                                Copilot AI
                            </span>
                        </Link>
                    )}
                    <Link
                        href={'/perpustakaan'}
                        onClick={() => {
                            tracker?.genericTrack(
                                `Click Library ${
                                    !fullHeight ? 'Course ' : ''
                                }Navigation`
                            );
                        }}>
                        <span
                            className={cn(
                                'flex gap-4 cursor-pointer  font-body text-sm hover:text-[#999999]',
                                pathname.includes('/perpustakaan')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            )}>
                            <BookStackIcon
                                size={20}
                                fill={
                                    pathname.includes('/perpustakaan')
                                        ? 'white'
                                        : 'none'
                                }
                            />
                            Perpustakaan
                        </span>
                    </Link>
                </>
            );
        }
    };

    return (
        <aside
            className={cn(
                'hidden md:block bg-[#181818] w-[250px] px-4 py-4 z-[1000] space-y-4',
                fullHeight ? 'fixed h-full' : 'h-fit sticky',
                className
            )}>
            <RoleSwitcher />
            <div className="flex flex-col gap-[18px]">{renderMenuItem()}</div>
        </aside>
    );
};

export default Sidebar;
