import Link from 'next/link';
import { ChevronDownIcon } from 'lucide-react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';

const contentClassName =
    'transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] ' +
    'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ' +
    'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] ' +
    'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] ' +
    'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] ' +
    'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]';

function NavigationMenuItem({
    label,
    children,
    href,
    isActive = false
}: {
    label: string | JSX.Element;
    children?: JSX.Element;
    href?: string;
    isActive?: boolean;
}): JSX.Element {
    return (
        <NavigationMenu.Item>
            {href ? (
                <Link
                    href={href}
                    className={`${
                        isActive ? 'text-[#B6A6F3]' : 'text-white'
                    } flex items-center gap-1 text-sm leading-[125%] font-semibold hover:text-[#B6A6F3] hover:bg-black hover:bg-opacity-30 px-3 py-2 rounded-lg`}>
                    {label}
                </Link>
            ) : (
                <NavigationMenu.Trigger
                    className={`${
                        isActive ? 'text-[#B6A6F3]' : 'text-white'
                    } flex items-center gap-1 text-sm leading-[125%] font-semibold data-[popup-open]:text-[#B6A6F3] data-[popup-open]:bg-black data-[popup-open]:bg-opacity-30 px-3 py-2 rounded-lg`}>
                    {label}
                    <NavigationMenu.Icon className="transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180">
                        <ChevronDownIcon size={16} />
                    </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
            )}

            {children ? (
                <NavigationMenu.Content className={contentClassName}>
                    {children}
                </NavigationMenu.Content>
            ) : null}
        </NavigationMenu.Item>
    );
}

export default NavigationMenuItem;
