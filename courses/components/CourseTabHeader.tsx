export const Header: React.FC<{ title: string; subtitle?: string }> = ({
    title,
    subtitle
}) => (
    <div className="mb-4">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
);
