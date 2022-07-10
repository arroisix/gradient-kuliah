const Container = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <section className="px-4 md:px-[7.5rem] mb-16 md:mb-32">
            {children}
        </section>
    );
};

export default Container;
