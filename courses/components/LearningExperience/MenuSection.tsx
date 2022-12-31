const MenuSection = ({
    tab,
    setTab
}: {
    tab: number;
    setTab: (tab: number) => void;
}): JSX.Element => {
    return (
        <div className="flex w-full">
            <div
                aria-hidden={true}
                className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                    tab === 0
                        ? 'border-b-2 border-[#C4B9FF] font-bold text-[#C4B9FF]'
                        : 'text-neutral-200'
                }`}
                onClick={() => setTab(0)}>
                <span>DESKRIPSI</span>
            </div>
            {/* <div
                aria-hidden={true}
                className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                    tab === 1
                        ? 'border-b-2 border-[#C4B9FF] font-bold text-[#C4B9FF]'
                        : 'text-neutral-200'
                }`}
                onClick={() => setTab(1)}>
                <span>LATIHAN SOAL</span>
            </div> */}
            <div
                aria-hidden={true}
                className={`text-[1rem] w-full text-center px-1 pt-1 pb-3 cursor-pointer ${
                    tab === 2
                        ? 'border-b-2 border-[#C4B9FF] font-bold text-[#C4B9FF]'
                        : 'text-neutral-200'
                }`}
                onClick={() => setTab(2)}>
                <span>DISKUSI</span>
            </div>
        </div>
    );
};

export default MenuSection;
