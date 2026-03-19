import {
    useGetConnectedDevicesQuery,
    useGetCurrentConnectedDeviceQuery,
    useGetDeviceTypesQuery,
    useRemoveOtherDeviceMutation
} from 'authentication/redux/api/authApi';
import groupBy from 'lodash.groupby';
import Button from 'commons/components/elements/Button';
import { useEffect, useMemo, useState } from 'react';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Modal from 'commons/components/modules/Modal';
import { DEVICE_TYPE_ICON } from 'profile/components/DeviceLogoutSelection';
import { useRouter } from 'next/router';
import useLogout from 'authentication/hooks/useLogout';

const KeluarPerangkat = (): JSX.Element => {
    const router = useRouter();
    const { logout, isLoadingLogout } = useLogout();
    const { deviceTypes } = useGetDeviceTypesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            deviceTypes:
                data?.reduce((acc, deviceType) => {
                    acc[deviceType.id] = deviceType;
                    return acc;
                }, {} as Record<number, DeviceTypeResponse | undefined>) ?? {}
        })
    });
    const { data: connectedDevices } = useGetConnectedDevicesQuery(undefined);
    const { data: currentDevice, isSuccess: currentDeviceIsSuccess } =
        useGetCurrentConnectedDeviceQuery();

    const initialCurrentDeviceAllowed = useMemo(
        () => currentDeviceIsSuccess && currentDevice?.device_allowed,
        [currentDeviceIsSuccess, currentDevice]
    );
    useEffect(() => {
        if (initialCurrentDeviceAllowed) {
            router.replace('/');
        }
    }, [initialCurrentDeviceAllowed, router]);

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
    const CurrentDeviceIcon = DEVICE_TYPE_ICON[currentDeviceType?.id ?? 1];

    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [removeOtherDevice, { isLoading: removeOtherDeviceIsLoading }] =
        useRemoveOtherDeviceMutation();

    if (!currentDeviceType || !currentDevice || initialCurrentDeviceAllowed) {
        return <LoadingBackdrop />;
    }

    return (
        <main className="min-h-screen text-white bg-neutral-1000 flex justify-center items-center">
            <div className="max-w-[357px] mx-[18px] mt-20 mb-12 flex flex-col gap-12">
                <div className="flex flex-col gap-8 text-center">
                    <h2 className="font-semibold text-xl">
                        Kamu sudah login di{' '}
                        {currentDeviceType.name.toLowerCase()} lain
                    </h2>

                    <section className="flex flex-col items-center gap-1">
                        <CurrentDeviceIcon width={80} height="auto" />
                        <h3 className="font-semibold text-sm">
                            {currentDeviceType.name}
                        </h3>
                        <p className="text-neutral-400 text-xs">
                            Aktif di{' '}
                            {
                                filteredConnectedDevices[currentDeviceType.id]
                                    ?.length
                            }{' '}
                            perangkat lain
                        </p>
                    </section>

                    <p className="text-sm">
                        Untuk keamanan, akunmu hanya bisa dipakai di{' '}
                        {currentDeviceType.max_count}{' '}
                        {currentDeviceType.name.toLowerCase()} pada satu waktu.
                    </p>
                </div>

                <section className="flex flex-col gap-3 px-[14.5px]">
                    <Button
                        onClick={() => {
                            setOpenConfirmationModal(true);
                        }}
                        variant="primary"
                        className="!py-3 text-base text-center font-semibold">
                        Login di {currentDeviceType.name.toLowerCase()} ini
                    </Button>
                    <Button
                        variant="custom"
                        className="!py-3 text-base bg-[#212121] text-center font-semibold"
                        disabled={isLoadingLogout}
                        onClick={async () => {
                            await logout();
                        }}>
                        {isLoadingLogout
                            ? 'Tunggu Sebentar...'
                            : 'Kembali ke Halaman Utama'}
                    </Button>
                </section>
            </div>

            <Modal
                isOpen={openConfirmationModal}
                setOpen={setOpenConfirmationModal}
                variant="dark"
                dialog
                className="md:!max-w-[398px]">
                <main className="flex flex-col items-center gap-8">
                    <div className="flex flex-col gap-2 w-full text-center">
                        <h4 className="text-base font-semibold">
                            Login di {currentDeviceType.name.toLowerCase()} ini?
                        </h4>
                        <p className="text-sm text-neutral-400">
                            Sesi di {currentDeviceType.name.toLowerCase()} lain
                            akan otomatis berakhir.
                        </p>
                    </div>
                    <footer className="flex flex-col gap-3 self-stretch">
                        <Button
                            variant="primary"
                            className="text-base text-center font-semibold h-[44px]"
                            disabled={removeOtherDeviceIsLoading}
                            onClick={async () => {
                                await removeOtherDevice();
                                setOpenConfirmationModal(false);
                                router.replace(
                                    (router.query.redirect as string) ?? '/'
                                );
                            }}>
                            {removeOtherDeviceIsLoading
                                ? 'Tunggu sebentar...'
                                : 'Ya, login disini'}
                        </Button>
                        <Button
                            variant="custom"
                            className="text-base bg-[rgba(255,255,255,0.10)] text-center font-semibold h-[44px]"
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
