import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { ChevronDownIcon } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface CourseDropdownProps {
    selectedCourseId: string;
    setSelectedCourseId: Dispatch<SetStateAction<string>>;
}

function CourseDropdown({
    selectedCourseId,
    setSelectedCourseId
}: CourseDropdownProps): JSX.Element {
    const { data: courses, isLoading: isLoadingCourses } =
        useGetPrivateListCoursesV2Query({});

    const selectedCourseName = useMemo(() => {
        if (courses?.data.length === 0) {
            return 'Semua Materi';
        }

        const course = courses?.data.find((v) => v.id === selectedCourseId);
        return course ? course.course_name : 'Semua Materi';
    }, [courses?.data, selectedCourseId]);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                disabled={isLoadingCourses}
                type="button"
                className="shrink-0 text-white bg-[#20222E] py-2 px-4 rounded-full font-bold text-sm leading-tight flex justify-center items-center gap-2 outline-none h-fit">
                {selectedCourseName}{' '}
                <ChevronDownIcon className="shrink-0 text-white w-5 h-5" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                align="end"
                className="z-[9999] animate-fade-down animate-duration-300 bg-[#2C2C2C] border border-[#666666] rounded-lg min-w-[--radix-popper-anchor-width] max-w-full mt-2 mr-auto overflow-hidden">
                {courses?.data.map((v) => (
                    <DropdownMenu.Item
                        key={v.id}
                        onClick={() =>
                            setSelectedCourseId(
                                selectedCourseId === v.id ? '' : v.id
                            )
                        }
                        className="text-white text-sm leading-tight py-2 px-4 outline-none hover:opacity-75 cursor-pointer border-b border-b-[#666666] last-of-type:border-b-0">
                        {v.course_name}
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export { CourseDropdown };
