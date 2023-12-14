import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

enum TabStyle {
    active = 'border-accent-purple font-bold',
    default = 'border-[#2D2D2D] font-medium text-neutral-600'
}
const MobileTabs = (): JSX.Element => {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { pathname } = router;

    const tabStyle = (activePath: string | string[]): string => {
        let isActive;
        if (typeof activePath === 'string') isActive = pathname === activePath;
        else isActive = activePath.includes(pathname);

        return cn(
            'text-center text-sm w-1/2 py-[6px] border-b-2',
            isActive ? TabStyle.active : TabStyle.default
        );
    };

    return (
        <div className="relative flex justify-between w-full overflow-hidden">
            <Link
                className={tabStyle(['/komunitas', '/komunitas/public'])}
                href="/komunitas">
                Eksplor
            </Link>
            {isAuthenticated && (
                <Link
                    href="/komunitas/pertanyaan-ku"
                    className={tabStyle('/komunitas/pertanyaan-ku')}>
                    Pertanyaanku
                </Link>
            )}
        </div>
    );
};

export default MobileTabs;
