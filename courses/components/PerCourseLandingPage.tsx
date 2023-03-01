import { useState } from 'react';

interface Teacher {
    Gelar: string;
    Nama: string;
    Gelar2: string;
    Title: string;
    Education: string;
    id: number;
}

interface Video {
    ImageLink: string;
    NamaChapter: string;
    Durasi: string;
    Status: string;
    id: number;
}

const TeacherData: Teacher[] = [
    {
        Gelar: 'Dr',
        Nama: 'Budi Budiman',
        Gelar2: 'S. Kom',
        Title: 'Ph.D',
        Education: 'S2 In Stanford University',
        id: 1
    },
    {
        Gelar: 'Dr',
        Nama: 'Yung Yung',
        Gelar2: 'S. Kom',
        Title: 'Ph.D',
        Education: 'S2 In Stanford University',
        id: 2
    }
];

const VideoList: Video[] = [
    {
        ImageLink:
            'https://cdn.discordapp.com/attachments/1015898025098493954/1064861145485279262/Component_22.png',
        NamaChapter: 'Dasar Integral',
        Durasi: '3:02',
        Status: 'https://media.discordapp.net/attachments/1015898025098493954/1074193597508886578/check_circle_24px.png',
        id: 1
    },
    {
        ImageLink:
            'https://cdn.discordapp.com/attachments/1015898025098493954/1064861145485279262/Component_22.png',
        NamaChapter: 'Dasar Integral',
        Durasi: '3:02',
        Status: 'https://media.discordapp.net/attachments/1015898025098493954/1074193597244637194/play_circle_outline_24px.png',
        id: 2
    },
    {
        ImageLink:
            'https://cdn.discordapp.com/attachments/1015898025098493954/1064861145485279262/Component_22.png',
        NamaChapter: 'Dasar Integral',
        Durasi: '3:02',
        Status: 'https://media.discordapp.net/attachments/1015898025098493954/1074193597026553896/article.png',
        id: 3
    },
    {
        ImageLink:
            'https://cdn.discordapp.com/attachments/1015898025098493954/1064861145485279262/Component_22.png',
        NamaChapter: 'Dasar Integral',
        Durasi: '3:02',
        Status: 'https://media.discordapp.net/attachments/1015898025098493954/1074193597508886578/check_circle_24px.png',
        id: 4
    }
];

const PerCourseLandingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex relative">
            <div className="flex absolute">
                <img
                    src="https://media.discordapp.net/attachments/1015898025098493954/1064861145699192892/Rectangle_52.png"
                    className="object-cover h-80 w-screen lg:object-cover lg:h-fit"
                    alt="Cover"
                />
                <div className="absolute h-20 w-screen self-end border-hidden outline-none mix-blend-multiply bg-gradient-to-b from-transparent to-black lg:h-40" />
            </div>
            <div className="flex relative flex-col">
                {/* Course Details (Progress Bar + Title) */}
                <div className="mt-60 p-5 flex flex-col gap-2 w-screen lg:w-3/6 lg:mt-48 lg:ml-8">
                    {/* Course Title */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-sm lg:text-base">
                            Introduction to Calculus
                        </h1>
                        <div className="h-px bg-gray-500 w-full lg:ml-3 lg:w-9/12" />
                        <div className="text-xs text-gray-500 lg:ml-3">
                            TERAKHIR DIPELAJARI
                        </div>
                        <h1 className="text-xl font-bold lg:ml-3 lg:text-2xl">
                            Integral Tentu - Judul Materi
                        </h1>
                    </div>

                    {/* Progress Bar + Button */}
                    <div className="flex flex-col gap-3 mt-1 lg:flex-row-reverse lg:justify-end lg:ml-3">
                        {/* Progress Bar */}
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-2 bg-gray-500 rounded-full w-full lg:w-8/12" />
                            <div className="">
                                Progress Belajar: {''}
                                <span className="font-semibold text-green-500">
                                    3%
                                </span>
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            className="p-1.5 w-full bg-purple-600 rounded-full cursor-pointer lg:w-5/12"
                            type="button">
                            Lanjut Belajar
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:mt-72 lg:items-start lg:flex-row-reverse lg:justify-center">
                    {/* Course Description + Teachers */}
                    <div className="px-5 py-2 w-screen lg:w-4/12">
                        <div className="bg-zinc-900 p-4 rounded-xl flex flex-col gap-2">
                            {/* Course Description */}
                            <h1 className="font-semibold text-gray-500">
                                Tentang Kelas Ini
                            </h1>
                            <div className="h-px bg-gray-500 w-full" />
                            <div className="text-sm">
                                Kalkulus adalah bllablbalbalba blablabl
                                lablablaba blablaasdasd askfsdgsdgsdg
                                ashfnasofnasofnasf asfnasdam aosdasobfuas
                                oasifaosif aosidhoaif kaoks foiasnflabblaba
                                blabld askfjnasojfnasm ashfnasofnasofnasf
                                asfnasdam aosdasobfuas oasifaosif aosidhoaif
                                kaoks foiasnf
                            </div>

                            {/* Teachers */}
                            <div className="text-sm text-gray-500">
                                PENGAJAR
                            </div>
                            <div className="flex flex-col gap-2">
                                {TeacherData.map((Teacher) => (
                                    <div
                                        className="flex gap-2 items-center"
                                        key={Teacher.id}>
                                        {/* Profile Photo */}
                                        <div className="w-11 h-11 rounded-full bg-white" />

                                        {/* Teacher Name & Teacher Title */}
                                        <div className="flex flex-col text-sm">
                                            <p>
                                                {`${Teacher.Gelar}. ${Teacher.Nama} ${Teacher.Gelar2}, ${Teacher.Title}`}
                                            </p>
                                            <p className="font-semibold">
                                                {`${Teacher.Education}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Other Parts */}
                    <div className="px-5 py-4 w-screen flex flex-col gap-6 lg:w-4/12">
                        {/* Search Bar */}
                        <div className="p-3 flex justify-between items-center bg-zinc-900 rounded-xl">
                            <p className="text-sm text-gray-500">Cari materi</p>
                            <img
                                src="https://media.discordapp.net/attachments/1015898025098493954/1074189418606370846/search_24px.png"
                                alt="Search"
                            />
                        </div>

                        {/* More Classes */}
                        <div className="p-4 flex flex-col gap-4 bg-zinc-900 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="flex justify-between font-bold">
                                <p>Sistem Bilangan</p>
                                {!isOpen ? (
                                    <img
                                        src="https://media.discordapp.net/attachments/1015898025098493954/1067715935303106620/expand_more.png"
                                        alt="Show More"
                                    />
                                ) : (
                                    <img
                                        src="https://media.discordapp.net/attachments/1015898025098493954/1073100357770682378/expand_less.png"
                                        alt="Show Less"
                                    />
                                )}
                            </button>

                            {/* Video List */}
                            {isOpen && (
                                <div className="flex flex-col gap-2">
                                    {VideoList.map((Video) => (
                                        <div
                                            className="flex justify-around items-center lg:justify-center lg:gap-3"
                                            key={Video.id}>
                                            <img
                                                src={Video.ImageLink}
                                                className="h-15 w-24"
                                                alt="Video Thumbnail"
                                            />
                                            <img
                                                src={Video.Status}
                                                className="h-4 w-4"
                                                alt="Completion - Status"
                                            />
                                            <div className="flex flex-col">
                                                <p className="text-sm">
                                                    {Video.NamaChapter}
                                                </p>
                                                <p className="text-sm">
                                                    {Video.Durasi}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Other Topics */}
                        <div className="flex flex-col gap-2 bg-zinc-900 rounded-xl p-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="flex justify-between">
                                <p className="font-bold">Limit</p>
                                {!isOpen ? (
                                    <img
                                        src="https://media.discordapp.net/attachments/1015898025098493954/1067715935303106620/expand_more.png"
                                        alt="Show More"
                                    />
                                ) : (
                                    <img
                                        src="https://media.discordapp.net/attachments/1015898025098493954/1073100357770682378/expand_less.png"
                                        alt="Show Less"
                                    />
                                )}
                            </button>

                            {/* Content */}
                            <div className="text-xs text-gray-500">
                                Sabar ya, materi ini akan segera hadir untukmu.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerCourseLandingPage;

{
    /* Progress */
    /* Things to do :

    1. Move everything to the middle
    2. Add the sticky functionality to Course Description and Teachers
    3. Add Toggle list functionality using react state and smoothen out the animation.
    4. Add Search Bar functionality
    5. Connect with API Call and Back End Data.

*/
}
