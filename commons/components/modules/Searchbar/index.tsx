import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import SearchInput from './SearchInput';

const SearchBar = (): JSX.Element => {
    const [isActive, toggleActive] = useState(false);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    if (isMobileBreakpoints)
        return (
            <div>
                <button
                    onClick={() => toggleActive((prev) => !prev)}
                    className="flex items-center w-full gap-2 rounded-full input input-sm bg-[#20222E] text-graphite-400 text-sm">
                    <BiSearch size={20} />
                    <span className="text-left line-clamp-1">
                        {isAuthenticated
                            ? 'Cari topik, materi, atau soal apapun'
                            : 'Cari'}
                    </span>
                </button>
                {isActive && (
                    <div className="w-full fixed top-0 inset-x-0 z-20 bg-[#222222] flex flex-auto items-center gap-4 px-4 min-h-14">
                        <button
                            onClick={() => toggleActive((prev) => !prev)}
                            className="btn btn-square btn-sm btn-ghost text-graphite-400">
                            <BsArrowLeft size={20} />
                        </button>
                        <SearchInput isAutoFocus className="grow" />
                    </div>
                )}
            </div>
        );

    return <SearchInput />;
};

export default SearchBar;
