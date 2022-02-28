import ContentBox from 'src/courses/components/ContentBox';

const About = ({ course }: { course: Course }): JSX.Element => {
    return (
        <section className="px-4 md:px-[7.5rem] mb-16 md:mb-32">
            <div className="w-full flex flex-col h-full">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                    Tentang Kelas Ini
                </h1>
                <ContentBox
                    chapters={course.chapters}
                    trailer={{
                        id: 'trailer',
                        videoUrl: course.trailer,
                        description: course.description,
                        duration: '',
                        isFree: true,
                        thumbnail: course.thumbnail
                    }}
                    description={course.description}
                    thumbnail={course.thumbnail}
                />
            </div>
        </section>
    );
};

export default About;
