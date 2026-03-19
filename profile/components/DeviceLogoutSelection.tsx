import GalaxyS9 from 'commons/components/elements/Icons/GalaxyS9';
import Tablet from 'commons/components/elements/Icons/Tablet';
import Macbook from 'commons/components/elements/Icons/Macbook';
import Button from 'commons/components/elements/Button';

export const DeviceLogoutSelection = ({
    deviceName,
    connectedDeviceCount,
    DeviceIcon,
    onClickLogout,
    isCurrentDevice = false
}: {
    deviceName: string;
    connectedDeviceCount: number;
    DeviceIcon: (props: any) => JSX.Element;
    onClickLogout?: () => Promise<void>;
    isCurrentDevice?: boolean;
}): JSX.Element => {
    return (
        <li className="flex justify-between border-solid border-b-neutral-800 border-b-[1px] py-3 items-center">
            <div className="flex gap-1 items-center">
                <div className="w-12 h-12 flex justify-center items-center">
                    <DeviceIcon />
                </div>
                <section className="font-body">
                    <p className="text-sm font-semibold mb-1">{deviceName}</p>
                    <p className="text-neutral-400 text-xs">
                        {connectedDeviceCount} perangkat
                    </p>
                </section>
            </div>
            {isCurrentDevice && (
                <Button
                    variant="custom"
                    className="text-xs !font-sans font-bold !px-4 !py-2 bg-[#212121] h-min"
                    onClick={onClickLogout}>
                    Logout
                </Button>
            )}
        </li>
    );
};

export const DEVICE_TYPE_ICON: Record<number, (props: any) => JSX.Element> = {
    1: (props) => <GalaxyS9 {...props} />,
    2: (props) => <Tablet {...props} />,
    3: (props) => <Macbook {...props} />
};
