import ContentBox from 'src/courses/components/ContentBox';

const About = ({ course }: { course: Course }): JSX.Element => {
    return (
        <section className="px-[7.5rem] mb-32">
            <div className="w-full flex flex-col h-full">
                <h1 className="text-[2.25rem] font-bold mb-2">
                    Tentang Kelas Ini
                </h1>
                <ContentBox
                    chapters={course.chapters}
                    trailer={course.trailer}
                    description={course.description}
                    thumbnail={course.thumbnail}
                />
            </div>
        </section>
    );
};

export default About;
