import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetClassProgressQuery } from 'dashboard/redux/api/dashboardApi';
import React, { useState } from 'react';

const MyClassesAccordion = ({
    isLoading,
    courses
}: {
    isLoading: boolean;
    courses?: GetDashboardContentResponse['my_class'];
}): JSX.Element => {
    const [course, setCourse] = useState('');
    const { data } = useGetClassProgressQuery(
        { slug: course },
        { skip: !course }
    );

    return (
        <div className="space-y-4 md:pr-16">
            <h4 className="text-lg font-extrabold md:text-xl">Kelasku</h4>
            {isLoading ? (
                <Skeleton />
            ) : (
                courses?.map(({ course_slug: slug, name }) => (
                    <label
                        key={slug}
                        className="rounded-lg collapse collapse-arrow bg-neutral-800">
                        <input
                            type="checkbox"
                            name="kelasku"
                            onChange={() =>
                                setCourse((prev) => (prev == slug ? '' : slug))
                            }
                            checked={slug == course}
                            className="min-h-0"
                        />
                        <div className="!px-4 !py-3 font-bold collapse-title min-h-fit md:!py-4 md:!px-5 collapse-arrow">
                            {name}
                        </div>
                        <div className="collapse-content">
                            <p>hello</p>
                            <Button
                                variant="custom"
                                className="w-full text-xs text-black bg-white">
                                Lihat Kelas
                            </Button>
                        </div>
                    </label>
                ))
            )}
        </div>
    );
};

export default MyClassesAccordion;
