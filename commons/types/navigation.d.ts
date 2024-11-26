interface NavLink {
    enabled?: boolean;
    href: string;
    label: string;
    tooltip?: string;
}

interface AppbarNav {
    icon: React.ReactNode;
    iconAlt?: React.ReactNode;
    href: string;
    label: string;
    isExpandable?: boolean;
    isAlt?: boolean;
    expandedLinks?: ExpandedLink[];
}

interface ExpandedLink {
    href: string;
    label: string;
    icon: React.ReactNode;
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
    tooltip?: string;
}

interface NavigationButtonProps extends NavigationButtonInterface {
    setOpenSidebar?: Dispatch<SetStateAction<boolean>>;
}
