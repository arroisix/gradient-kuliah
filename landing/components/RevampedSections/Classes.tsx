import React from 'react';
import Button from 'commons/components/elements/Button';
import Container from './Container';
import ClassCard from './ClassCard';

type ClassesProps = {
    classData?: Course[];
};

const Classes = ({ classData }: ClassesProps): JSX.Element => {
    return (
        <Container className="my-9 md:my-24">
            <h2 className="text-xl font-extrabold leading-relaxed text-center md:text-3xl">
                Ikuti kelas dari dosen berkualitas
            </h2>
            <p className="text-sm text-center md:text-xl text-neutral-300">
                Dosen dari universitas ternama
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 md:mt-10 md:grid-cols-4 md:gap-x-5 lg:gap-x-8">
                {classData?.map((course) => (
                    <ClassCard
                        key={course.id}
                        cover={course.thumbnail}
                        slug={course.slug}
                        title={course.course_name}
                        eventPayload={{
                            Variant: 'NOV 2023',
                            'Accessed from': 'LANDING'
                        }}
                    />
                ))}
            </div>
            <div className="flex justify-center mt-6 md:mt-10">
                <Button
                    variant="custom"
                    href="/kelas"
                    eventName='Click "Lihat Semua" for Class'
                    className="bg-neutral-800">
                    Lihat Semua Kelas
                </Button>
            </div>
        </Container>
    );
};

export default Classes;
