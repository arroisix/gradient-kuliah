interface NavLink {
    enabled?: boolean;
    href: string;
    label: string;
}

interface AppbarNav {
    icon: JSX.Element;
    label: string;
    href: string;
    alias?: string[];
}

interface NavigationButtonInterface {
    name: string;
    title: string;
    url: string;
    IconActive?: IconType;
    IconUnactive?: IconType;
    className?: string;
    subMenus?: NavigationButtonInterface[];
    children?: ReactNode;
}

interface NavigationButtonProps extends NavigationButtonInterface {
    setOpenSidebar?: Dispatch<SetStateAction<boolean>>;
}
