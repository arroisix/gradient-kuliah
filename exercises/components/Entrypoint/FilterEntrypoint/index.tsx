import Filter from 'commons/components/elements/Filter';
import FilterIcon from 'commons/components/elements/Icons/Filter';
import { cn } from 'commons/utils';
import {
    useGetCoursesWithExerciseQuery,
    useGetUniversitiesWithExerciseQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import FilterModal from './FilterModal';

const FilterEntrypoint = (): JSX.Element => {
    const router = useRouter();
    const {
        status = '',
        course_id = '',
        university_name = '',
        type = ''
    } = router.query;

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const { data: courseData } = useGetCoursesWithExerciseQuery();
    const { data: universityData } = useGetUniversitiesWithExerciseQuery();

    useEffect(() => {
        // Add any side effects or logic here if needed
        if (universityData?.default_value) {
            console.log('Default university:', universityData.default_value);
            router.push(
                {
                    query: {
                        ...router.query,
                        university_name: universityData.default_value
                    }
                },
                undefined,
                { shallow: true }
            );
        }
    }, [universityData]);

    const handleCourseChange = (newCourseId: string): void => {
        router.push(
            { query: { ...router.query, course_id: newCourseId, page: 1 } },
            undefined,
            {
                shallow: true
            }
        );
    };

    const handleUniversityChange = (newUniversityName: string): void => {
        router.push(
            {
                query: {
                    ...router.query,
                    university_name: newUniversityName,
                    page: 1
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    const courseFilterOptions = useMemo(() => {
        const options = [
            { value: '', label: 'Semua Matkul' },
            ...(courseData?.data.map((course) => ({
                value: course.id,
                label: course.name
            })) || [])
        ];
        return options;
    }, [courseData]);

    const universitiesFilterOptions = useMemo(() => {
        const options = [
            { value: '', label: 'Semua Universitas' },
            ...(universityData?.data.map((university) => ({
                value: university,
                label: university
            })) || [])
        ];
        return options;
    }, [universityData]);

    const handleFilterModalApply = (
        courseId: string,
        universityName: string,
        statusValue: string,
        typeValue: string
    ) => {
        router.push(
            {
                query: {
                    ...router.query,
                    course_id: courseId,
                    university_name: universityName,
                    status: statusValue,
                    type: typeValue,
                    page: 1
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center my-4">
            <h2 className="text-sm font-normal">
                Pilih mata kuliah dan kampus :
            </h2>
            <div className="flex gap-4 items-center justify-center md:justify-start w-full md:w-auto">
                <Filter
                    key={'courses'}
                    options={courseFilterOptions}
                    defaultSelected={course_id as string}
                    onChange={handleCourseChange}
                    title="Mata Kuliah"
                />
                <Filter
                    key={'universities'}
                    options={universitiesFilterOptions}
                    defaultSelected={university_name as string}
                    onChange={handleUniversityChange}
                    title="Universitas"
                />
                <button
                    tabIndex={0}
                    onClick={() => setIsFilterModalOpen(true)}
                    className={cn(
                        'flex justify-between items-center gap-2 text-xs font-bold p-3 bg-[#20222E] rounded-full hover:bg-[#2C2E3A] transition-colors'
                    )}>
                    <FilterIcon />
                </button>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                courseOptions={courseFilterOptions}
                universityOptions={universitiesFilterOptions}
                selectedCourse={course_id as string}
                selectedUniversity={university_name as string}
                selectedStatus={status as string}
                selectedType={type as string}
                onApply={handleFilterModalApply}
            />
        </div>
    );
};

export default FilterEntrypoint;
