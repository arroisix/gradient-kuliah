import ComingSoon from 'commons/components/elements/Icons/ComingSoon';

const ComingSoonContent = (): JSX.Element => {
    return (
        <div className="flex p-4">
            <div className="w-1/5 flex items-center justify-center">
                <div className="mr-4">
                    <ComingSoon />
                </div>
            </div>
            <div className="flex font-body text-neutral-600 flex-col w-4/5">
                <span>Segera Hadir</span>
            </div>
        </div>
    );
};

export default ComingSoonContent;
