import {
    useGetConnectedDevicesQuery,
    useGetDeviceTypesQuery,
    useRemoveOtherDeviceMutation
} from 'authentication/redux/api/authApi';
import { useRouter } from 'next/router';
import groupBy from 'lodash.groupby';
import { useSelector } from 'react-redux';
import { getCurrentDeviceTypeId } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import GalaxyS9 from 'commons/components/elements/Icons/GalaxyS9';
import Tablet from 'commons/components/elements/Icons/Tablet';
import Macbook from 'commons/components/elements/Icons/Macbook';

const KeluarPerangkat = (): JSX.Element => {
    const { deviceTypes } = useGetDeviceTypesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            deviceTypes:
                data?.reduce((acc, deviceType) => {
                    acc[deviceType.id] = deviceType;
                    return acc;
                }, {} as Record<number, DeviceTypeResponse>) ?? {}
        })
    });
    const { connectedDevices } = useGetConnectedDevicesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            connectedDevices: groupBy(data, 'device_type_id')
        })
    });

    const currentDeviceId = useSelector(getCurrentDeviceTypeId);
    const currentDevice = deviceTypes[currentDeviceId ?? 0];

    return (
        <main className="min-h-screen text-white bg-neutral-1000 flex justify-center">
            <div className="max-w-[325px] mx-[18px] mt-20 mb-12">
                {currentDevice && (
                    <h2 className="font-sans text-xl font-bold text-center">
                        Setiap akun hanya bisa login dari{' '}
                        {currentDevice?.max_count}{' '}
                        {currentDevice?.name.toLowerCase()}
                    </h2>
                )}

                <ul>
                    {Object.values(deviceTypes)
                        .filter((device) =>
                            connectedDevices?.hasOwnProperty(device?.id ?? '')
                        )
                        .map((device) => (
                            <DeviceLogoutSelection
                                key={device.id}
                                deviceName={device.name}
                                connectedDeviceCount={
                                    connectedDevices[device.id].length
                                }
                                isCurrentDevice={currentDeviceId === device.id}
                                DeviceIcon={deviceTypeIcon[device.id]}
                            />
                        ))}
                </ul>
            </div>
        </main>
    );
};

const DeviceLogoutSelection = ({
    deviceName,
    connectedDeviceCount,
    DeviceIcon,
    isCurrentDevice = false
}: {
    deviceName: string;
    connectedDeviceCount: number;
    DeviceIcon: () => JSX.Element;
    isCurrentDevice?: boolean;
}): JSX.Element => {
    const router = useRouter();
    const [removeOtherDevice] = useRemoveOtherDeviceMutation();

    return (
        <li className="flex justify-between border-solid border-b-neutral-800 border-b-[1px] py-3">
            <div className='flex gap-1'>
                <div className='w-12 h-12 flex justify-center items-center'>
                    <DeviceIcon />
                </div>
                <section>
                    <p>{deviceName}</p>
                    <p>{connectedDeviceCount} perangkat</p>
                </section>
            </div>
            {isCurrentDevice && (
                <Button
                    variant="primary"
                    size="extraSmall"
                    onClick={async () => {
                        await removeOtherDevice();
                        router.replace('/');
                    }}>
                    Logout
                </Button>
            )}
        </li>
    );
};

const deviceTypeIcon: Record<number, () => JSX.Element> = {
    1: GalaxyS9,
    2: Tablet,
    3: Macbook
};

KeluarPerangkat.displayName = 'Keluar Perangkat';
export default KeluarPerangkat;
