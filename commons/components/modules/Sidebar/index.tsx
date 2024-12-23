import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import CommunityNotificationBadge from 'commons/components/elements/CommunityNotificationBadge';
import CopilotIconLine from 'copilot/assets/CopilotIconLine';
import BookStackIcon from '../../elements/Icons/BookStack';
import KelasIcon from '../../elements/Icons/Kelas';
import PencilOnLineIcon from '../../elements/Icons/PencilLine';
import DiskusiIcon from '../../elements/Icons/Diskusi';
import HomeIcon from '../../elements/Icons/Home';

const Sidebar = ({
    fullHeight,
    className
}: {
    fullHeight?: boolean;
    className?: string;
}): JSX.Element => {
    const route = useRouter();
    const { pathname } = route;

    const { data: configData } = useGetConfigQuery();
    const tracker = useTracker();

    return (
        <aside
            className={cn(
                'hidden md:block top-[64px] bg-[#121212] w-[250px] pl-6 pr-3 py-4 z-10',
                fullHeight ? 'fixed h-full' : 'h-fit sticky',
                className
            )}>
            <div className="flex flex-col gap-[18px]">
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
                        <HomeIcon />
                        Home
                    </span>
                </Link>
                {configData?.configs.is_copilot_config_enabled && (
                    <Link
                        href={'/copilot'}
                        onClick={() => {
                            tracker?.genericTrack(
                                'Click Copilot Sidebar Navigation'
                            );
                        }}>
                        <span
                            className={`flex gap-4 cursor-pointer tooltip tooltip-right ${
                                pathname.includes('/copilot')
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            } font-body text-sm hover:text-[#999999]`}
                            data-tip="Copilot AI gratis selama versi Beta!">
                            <CopilotIconLine />
                            Copilot AI
                            <span className="flex items-center gap-2 ml-2 py-1 px-3 rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white">
                                Beta
                            </span>
                        </span>
                    </Link>
                )}
                <Link
                    href="/komunitas"
                    className={`flex items-center gap-4 cursor-pointer ${
                        pathname.includes('/komunitas')
                            ? 'text-white'
                            : 'text-[#666666]'
                    } font-body text-sm hover:text-[#999999]`}
                    onClick={() => {
                        tracker?.genericTrack(
                            `Click Community ${
                                !fullHeight ? 'Course ' : ''
                            }Navigation`
                        );
                    }}>
                    <DiskusiIcon />
                    Diskusi
                    <CommunityNotificationBadge />
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
                        <KelasIcon size={20} />
                        Kelas
                    </span>
                </Link>
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
                        <BookStackIcon size={20} />
                        Perpustakaan
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
                            <PencilOnLineIcon size={20} />
                            Latihan
                        </span>
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
