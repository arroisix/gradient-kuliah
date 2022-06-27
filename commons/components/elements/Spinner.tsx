const Spinner = ({
    size
}: {
    size: 'small' | 'medium' | 'large';
}): JSX.Element => {
    const HEIGHT = {
        small: '4',
        medium: '8',
        large: '12'
    };

    const WIDTH = {
        small: '4',
        medium: '8',
        large: '12'
    };

    return (
        <div className="flex justify-center items-center">
            <svg
                className={`animate-spin h-${HEIGHT[size]} w-${WIDTH[size]} border-2 border-transparent border-b-2 border-b-white border-l-white border-l-2 rounded-full`}
                viewBox="0 0 24 24"></svg>
        </div>
    );
};

export default Spinner;
