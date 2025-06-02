import ContentCard from 'dashboard/components/ContentCard';
import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import Filter from '../../../commons/components/elements/Filter';

interface DownloadContentProps {
    videos: DownloadedVideo[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    deviceFilter?: string;
    onDeviceFilterChange?: (value: string) => void;
    deviceFilterOptions?: { value: string; label: string }[];
    showDeviceFilter?: boolean;
}

const DownloadContent = ({
    videos,
    searchTerm,
    setSearchTerm,
    deviceFilter = 'all',
    onDeviceFilterChange,
    deviceFilterOptions,
    showDeviceFilter = false
}: DownloadContentProps): JSX.Element => {
    return (
        <div>
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

                {showDeviceFilter &&
                    deviceFilterOptions &&
                    onDeviceFilterChange && (
                        <Filter
                            options={deviceFilterOptions}
                            defaultSelected={deviceFilter}
                            onChange={onDeviceFilterChange}
                            className="w-48"
                        />
                    )}
            </div>

            {!videos || videos.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    {searchTerm ? (
                        <>
                            <p>
                                Tidak ada video yang ditemukan untuk &apos
                                {searchTerm}&apos
                            </p>
                            <p className="text-sm mt-2">
                                Coba kata kunci lain atau hapus filter
                            </p>
                        </>
                    ) : (
                        'No videos found'
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => {
                        return (
                            <ContentCard
                                key={video.id}
                                id={video.id}
                                title={video.title}
                                isMajorClass={true}
                                category="Video"
                                thumbnail={video.thumbnail}
                                href={`/kelas/${video.course_slug}/${video.video_slug}`}
                                courseName={video.course_name}
                                chapterName={video.chapter_title}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DownloadContent;
