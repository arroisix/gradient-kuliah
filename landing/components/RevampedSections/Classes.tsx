import Image from 'next/image';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useTracker } from 'tracker/tracker';
import Container from './Container';
import Link from 'next/link';
import Button from 'commons/components/elements/Button';

type ClassCardProps = {
    cover: string;
    title: string;
    slug: string;
};

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
                    />
                ))}
            </div>
            <div className="flex justify-center mt-6 md:mt-10">
                <Button
                    variant="custom"
                    href="/kelas"
                    className="bg-neutral-800">
                    Lihat Semua Kelas
                </Button>
            </div>
        </Container>
    );
};

const ClassCard = ({ cover, title, slug }: ClassCardProps): JSX.Element => {
    const tracker = useTracker();

    return (
        <Link
            className="relative bg-[#5F2BCE33] rounded-xl overflow-hidden cursor-pointer"
            href={`/kelas/${slug}`}
            onClick={() =>
                tracker?.genericTrack('Click Class Card', {
                    'Course Slug': slug
                })
            }
            aria-hidden>
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={cover}
                    loading="lazy"
                    layout="fill"
                    className="object-cover object-top"
                />
            </div>
            <div className="flex items-center justify-between gap-4 p-3">
                <p className="text-xs font-extrabold lg:overflow-hidden lg:whitespace-nowrap lg:text-ellipsis lg:text-base">
                    {title}
                </p>
                <FaChevronRight size={10} className="text-[#FFFFFF33]" />
            </div>
        </Link>
    );
};

export default Classes;
