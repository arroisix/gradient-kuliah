import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import {
    useGetDownloadDevicesQuery,
    useGetDownloadHistoryQuery
} from '../../learningTools/redux/api/learningToolsApi';
import Skeleton from '../../commons/components/elements/Skeleton';
import DownloadTabs from '../components/Downloads/DownloadTabs';
import EmptyDownloadState from '../components/Downloads/EmptyDownloadState';
import DownloadContent from '../components/Downloads/DownloadContent';

const DEVICE_FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Perangkat' },
    { value: 'phone', label: 'Handphone' },
    { value: 'tablet', label: 'Tablet' }
];

const DownloadsContainer = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
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
                is_removed: true,
                page: 1,
                limit: 12
            },
            {
                skip: !isAuthenticated
            }
        );

    // Set first device as default when data is loaded
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
                (d) => d.device_type.toLowerCase() === value.toLowerCase()
            );
            if (device) {
                setSelectedDevice(device.device_id);
            }
        }
    };

    const filteredDownloads =
        activeTab === 0
            ? downloads?.data?.filter(
                  (video) =>
                      debouncedSearchTerm === '' ||
                      video.title
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase()) ||
                      video.course_name
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase()) ||
                      video.chapter_title
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase())
              )
            : history?.data?.filter(
                  (video) =>
                      debouncedSearchTerm === '' ||
                      video.title
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase()) ||
                      video.course_name
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase()) ||
                      video.chapter_title
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase())
              );

    const isLoading =
        (activeTab === 0 && isLoadingDownloads) ||
        (activeTab === 1 && isLoadingHistory);
    const hasData =
        activeTab === 0
            ? downloads?.data && downloads.data.length > 0
            : history?.data && history.data.length > 0;

    const renderSkeleton = () => {
        return (
            <div>
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
                    {isLoading ? (
                        renderSkeleton()
                    ) : !hasData ? (
                        <EmptyDownloadState
                            title={
                                activeTab === 0
                                    ? 'Download kamu masih kosong'
                                    : 'Kamu tidak memiliki riwayat download'
                            }
                            description="Telurusi kelas dan download video materi melalui aplikasi"
                        />
                    ) : (
                        <DownloadContent
                            videos={filteredDownloads || []}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            deviceFilter={deviceFilter}
                            onDeviceFilterChange={handleDeviceFilterChange}
                            deviceFilterOptions={DEVICE_FILTER_OPTIONS}
                            showDeviceFilter={activeTab === 1}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default DownloadsContainer;
