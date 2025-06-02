import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/router';
import { IoIosSearch } from 'react-icons/io';
import {
    useGetDownloadDevicesQuery,
    useGetDownloadHistoryQuery
} from '../../learningTools/redux/api/learningToolsApi';
import Skeleton from '../../commons/components/elements/Skeleton';
import DownloadTabs from '../components/Downloads/DownloadTabs';
import EmptyDownloadState from '../components/Downloads/EmptyDownloadState';
import DownloadContent from '../components/Downloads/DownloadContent';
import Filter from 'commons/components/elements/Filter';

const DEVICE_FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Perangkat' },
    { value: 'phone', label: 'Handphone' },
    { value: 'tablet', label: 'Tablet' }
];

const DownloadsContainer = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [deviceFilter, setDeviceFilter] = useState('all');

    const { data: devices } = useGetDownloadDevicesQuery(undefined, {
        skip: !isAuthenticated
    });

    const { data: downloads, isLoading: isLoadingDownloads } =
        useGetDownloadHistoryQuery(
            {
                device_id: selectedDevice || undefined,
                is_removed: false,
                keyword: debouncedSearchTerm || undefined,
                page: 1,
                limit: 12
            },
            {
                skip: !isAuthenticated || !selectedDevice
            }
        );

    const { data: history, isLoading: isLoadingHistory } =
        useGetDownloadHistoryQuery(
            {
                device_id: selectedDevice || undefined,
                is_removed: true,
                keyword: debouncedSearchTerm || undefined,
                page: 1,
                limit: 12
            },
            {
                skip: !isAuthenticated
            }
        );

    useEffect(() => {
        if (router.isReady && router.query.search) {
            const searchQuery = Array.isArray(router.query.search)
                ? router.query.search[0]
                : router.query.search;
            setSearchTerm(searchQuery);
        }
    }, [router.isReady, router.query.search]);

    useEffect(() => {
        if (devices && devices.data.length > 0 && !selectedDevice) {
            setSelectedDevice(devices.data[0].device_id);
        }
    }, [devices, selectedDevice]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };

    const handleDeviceFilterChange = (value: string) => {
        setDeviceFilter(value);

        if (value !== 'all' && devices) {
            const device = devices.data.find(
                (d: { device_type: string }) =>
                    d.device_type.toLowerCase() === value.toLowerCase()
            );
            if (device) {
                setSelectedDevice(device.device_id);
            }
        }
    };

    const currentVideos = activeTab === 0 ? downloads?.data : history?.data;

    const isLoading =
        (activeTab === 0 && isLoadingDownloads) ||
        (activeTab === 1 && isLoadingHistory);

    const hasData = currentVideos && currentVideos.length > 0;

    const renderSkeleton = () => {
        return (
            <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full h-56 !mb-0"
                            />
                        ))}
                </div>
            </div>
        );
    };

    const renderSearchAndFilter = () => {
        if (isLoading) {
            return (
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex-grow">
                        <Skeleton className="w-full h-10 rounded-full" />
                    </div>
                    {activeTab === 1 && (
                        <div className="w-48">
                            <Skeleton className="w-full h-10 rounded-full" />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Video"
                        className="w-full px-4 py-2 text-white border rounded-full bg-graphite-800 placeholder:text-graphite-600 border-graphite-600/50"
                    />
                    <IoIosSearch
                        size={20}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#DADADA] cursor-pointer"
                    />
                </div>

                {activeTab === 1 && (
                    <Filter
                        options={DEVICE_FILTER_OPTIONS}
                        defaultSelected={deviceFilter}
                        onChange={handleDeviceFilterChange}
                        className="w-48"
                    />
                )}
            </div>
        );
    };

    return (
        <>
            <Breadcrumb className="w-full pb-5" />
            <div className="relative w-full mx-auto xl:max-w-screen-2xl">
                <h1 className="text-2xl font-bold">Daftar Download</h1>
                <p className="text-sm text-gray-400 mt-2">
                    Semua video yang kamu download di aplikasi Gradient melalui
                    handphone atau tablet
                </p>

                <div className="mt-8">
                    <DownloadTabs
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </div>

                <div className="mt-6">
                    {renderSearchAndFilter()}

                    {isLoading ? (
                        renderSkeleton()
                    ) : !hasData ? (
                        <EmptyDownloadState
                            title={
                                debouncedSearchTerm
                                    ? `Tidak ada video terkait di Daftar Download ${
                                          deviceFilter === 'phone'
                                              ? 'handphone'
                                              : deviceFilter === 'tablet'
                                              ? 'tablet'
                                              : 'handphone'
                                      } kamu`
                                    : activeTab === 0
                                    ? 'Download kamu masih kosong'
                                    : 'Kamu tidak memiliki riwayat download'
                            }
                            description="Telurusi kelas dan download video materi melalui aplikasi"
                        />
                    ) : (
                        <DownloadContent videos={currentVideos || []} />
                    )}
                </div>
            </div>
        </>
    );
};

export default DownloadsContainer;
