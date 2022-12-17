const Container = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <section
            className={`min-h-screen w-full px-4 md:px-[7.5rem] py-4 flex ${className}`}>
            {children}
        </section>
    );
};

export default Container;
