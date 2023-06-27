import AuthContext from 'authentication/contexts/AuthProvider';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import DropdownFilter from 'komunitas/components/DropdownFilter';
import DropdownSort from 'komunitas/components/DropdownSort';
import KomunitasInput from 'komunitas/components/KomunitasInput';
import MobileTabs from 'komunitas/components/MobileTabs';
import QuestionCard from 'komunitas/components/QuestionCard';
import { useGetCommunityPostQuery } from 'komunitas/redux/api/komunitasApi';
import React, { useContext, useState } from 'react';
import { CgSearch } from 'react-icons/cg';

// const DUMMY_DATA = {
//     community_posts: [
//         {
//             id: '1',
//             content: 'haloo',
//             viewer_counts: 10,
//             comment_counts: 10,
//             created_at: 1687229985,
//             course_name: 'matematika',
//             student: {
//                 id: '90',
//                 photo_url: '',
//                 username: 'irfan.kamil'
//             }
//         },
//         {
//             id: '2',
//             content: 'bang aku ga ngerti',
//             viewer_counts: 17,
//             comment_counts: 3,
//             created_at: 1687229985,
//             course_name: 'fisika',
//             student: {
//                 id: '90',
//                 photo_url: '',
//                 username: 'irfan.kamil'
//             }
//         }
//     ],
//     total_items: 10,
//     current_page: 10,
//     items_per_page: 10
// };

const KomunitasContainer = (): JSX.Element => {
    const { profile } = useContext(AuthContext);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { data } = useGetCommunityPostQuery(
        profile ? { user_id: profile.user_id } : {}
    );

    const [search, setSearch] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState('LATEST');

    function handleChangeSearch(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        setSearch(event.target.value);
    }

    function handleChangeFilter(e: React.ChangeEvent<HTMLSelectElement>): void {
        console.log(e.target.value);
    }

    function handleChangeSort(event: any): void {
        console.log(event.target.id);
    }

    return (
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12 flex flex-col gap-6">
                <KomunitasInput
                    type="text"
                    name="search"
                    value={search}
                    placeholder="Cari pertanyaan"
                    onChange={handleChangeSearch}
                    rightIcon={<CgSearch />}
                />
                {isMobileBreakpoints && <MobileTabs />}
                <div className="flex justify-between items-center">
                    <h2 className="hidden md:block font-extrabold">Eksplor</h2>
                    <div className="flex gap-3 items-center w-full md:w-fit">
                        <DropdownFilter onChange={handleChangeFilter} />
                        <DropdownSort
                            showFilter={showFilter}
                            setShowFilter={setShowFilter}
                            filter={filter}
                            setFilter={setFilter}
                            onChange={handleChangeSort}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-[18px]">
                    {data?.community_posts.map((value) => (
                        <QuestionCard
                            key={value.id}
                            {...value}
                            clickable={true}
                        />
                    ))}
                </div>
            </div>
            <div className="hidden md:block w-full lg:w-4/12">Pertanyaanku</div>
        </section>
    );
};

export default KomunitasContainer;
