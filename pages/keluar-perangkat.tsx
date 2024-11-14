import {
    useGetConnectedDevicesQuery,
    useGetCurrentConnectedDeviceQuery,
    useGetDeviceTypesQuery,
    useLogoutMutation,
    useRemoveOtherDeviceMutation
} from 'authentication/redux/api/authApi';
import groupBy from 'lodash.groupby';
import Button from 'commons/components/elements/Button';
import { useEffect, useMemo, useState } from 'react';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Modal from 'commons/components/modules/Modal';
import Image from 'next/image';
import {
    DEVICE_TYPE_ICON,
    DeviceLogoutSelection
} from 'profile/components/DeviceLogoutSelection';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearCache } from 'authentication/redux/slices/userSlice';

const KeluarPerangkat = (): JSX.Element => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { deviceTypes } = useGetDeviceTypesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            deviceTypes:
                data?.reduce((acc, deviceType) => {
                    acc[deviceType.id] = deviceType;
                    return acc;
                }, {} as Record<number, DeviceTypeResponse>) ?? {}
        })
    });
    const { data: connectedDevices } = useGetConnectedDevicesQuery(undefined);
    const { data: currentDevice, isSuccess: currentDeviceIsSuccess } =
        useGetCurrentConnectedDeviceQuery();

    const initialCurrentDeviceAllowed = useMemo(
        () => currentDeviceIsSuccess && currentDevice?.device_allowed,
        [currentDeviceIsSuccess]
    );
    useEffect(() => {
        if (initialCurrentDeviceAllowed) {
            router.replace('/');
        }
    }, [initialCurrentDeviceAllowed]);

    const filteredConnectedDevices = useMemo(
        () =>
            groupBy(
                connectedDevices?.filter(
                    (device) => device.id != currentDevice?.id
                ),
                'device_type_id'
            ),
        [connectedDevices, currentDevice]
    );

    const currentDeviceType = deviceTypes[currentDevice?.device_type_id ?? 0];

    const [disableLogin, setDisableLogin] = useState(true);

    const [logout, { isLoading: isLoadingLogout }] = useLogoutMutation();

    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [removeOtherDevice] = useRemoveOtherDeviceMutation();

    if (!currentDeviceType || !currentDevice || initialCurrentDeviceAllowed) {
        return <LoadingBackdrop />;
    }

    return (
        <main className="min-h-screen text-white bg-neutral-1000 flex justify-center items-center">
            <div className="max-w-[325px] mx-[18px] mt-20 mb-12">
                <h2 className="font-sans text-xl font-bold text-center mb-8">
                    Setiap akun hanya bisa login dari{' '}
                    {currentDeviceType.max_count}{' '}
                    {currentDeviceType.name.toLowerCase()}
                </h2>

                <ul className="mb-12 p-0 m-0 min-h-[216px]">
                    {Object.values(deviceTypes)
                        .filter((device) =>
                            filteredConnectedDevices?.hasOwnProperty(
                                device?.id ?? ''
                            )
                        )
                        .map((device) => (
                            <DeviceLogoutSelection
                                key={device.id}
                                deviceName={device.name}
                                connectedDeviceCount={
                                    filteredConnectedDevices[device.id].length
                                }
                                isCurrentDevice={
                                    currentDeviceType.id === device.id
                                }
                                DeviceIcon={DEVICE_TYPE_ICON[device.id]}
                                onClickLogout={async () => {
                                    setOpenConfirmationModal(true);
                                }}
                            />
                        ))}
                </ul>

                <section className="flex flex-col gap-3">
                    <Button
                        href={(router.query.redirect as string) ?? '/'}
                        variant="primary"
                        disabled={disableLogin}
                        className="!py-3 text-base !font-sans text-center">
                        Masuk dari {currentDeviceType.name.toLowerCase()} ini
                    </Button>
                    <Button
                        variant="custom"
                        className="!py-3 text-base !font-sans bg-[#212121] text-center"
                        disabled={isLoadingLogout}
                        onClick={async () => {
                            await logout();
                            dispatch(clearCache());
                            setTimeout(() => {
                                router.push('/');
                            }, 500);
                        }}>
                        {isLoadingLogout
                            ? 'Tuggu Sebentar...'
                            : 'Kembali ke Halaman Utama'}
                    </Button>
                </section>
            </div>

            <Modal
                isOpen={openConfirmationModal}
                setOpen={setOpenConfirmationModal}
                variant="dark"
                dialog>
                <main className="flex flex-col items-center">
                    <Image
                        src="https://assets.gradient.academy/assets/logout-device2.png"
                        width={160}
                        height={160}
                    />
                    <h4 className="mt-5 mb-2 font-sans text-2xl font-bold">
                        Logout dari {currentDeviceType.name.toLowerCase()}?
                    </h4>
                    <p className="mb-8 text-base text-center text-neutral-400">
                        Kamu masih bisa login lagi di{' '}
                        {currentDeviceType.name.toLowerCase()} tersebut setelah
                        ini
                    </p>
                    <footer className="flex flex-col gap-3 self-stretch">
                        <Button
                            variant="primary"
                            className="!py-3 text-base !font-sans text-center"
                            onClick={async () => {
                                await removeOtherDevice();
                                setOpenConfirmationModal(false);
                                setDisableLogin(false);
                            }}>
                            Logout
                        </Button>
                        <Button
                            variant="custom"
                            className="!py-3 text-base !font-sans bg-[rgba(255,255,255,0.10)] text-center"
                            onClick={() => {
                                setOpenConfirmationModal(false);
                            }}>
                            Batalkan
                        </Button>
                    </footer>
                </main>
            </Modal>
        </main>
    );
};

KeluarPerangkat.displayName = 'Keluar Perangkat';
export default KeluarPerangkat;
