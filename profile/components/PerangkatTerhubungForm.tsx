import {
    useGetConnectedDevicesQuery,
    useGetDeviceTypesQuery
} from 'authentication/redux/api/authApi';
import groupBy from 'lodash.groupby';
import {
    DEVICE_TYPE_ICON,
    DeviceLogoutSelection
} from './DeviceLogoutSelection';

export const PerangkatTerhubungForm = (): JSX.Element => {
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

    return (
        <main className='mt-8'>
            <p className="text-neutral-400 font-body text-sm text-center mb-4">
                Maksimal 1 untuk setiap jenis perangkat
            </p>
            <ul className="mb-12 p-0 m-0 min-h-[216px]">
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
                            isCurrentDevice={false}
                            DeviceIcon={DEVICE_TYPE_ICON[device.id]}
                        />
                    ))}
            </ul>
        </main>
    );
};
