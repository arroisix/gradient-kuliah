type AstronotesKeywordProps = {
    keyword: string;
};

const AstronotesKeyword = ({
    keyword
}: AstronotesKeywordProps): JSX.Element => (
    <div className="border-[1px] border-[#999999] rounded-xl w-fit">
        <span className="text-white font-bold text-xs py-1 px-3">
            {keyword}
        </span>
    </div>
);

export default AstronotesKeyword;
