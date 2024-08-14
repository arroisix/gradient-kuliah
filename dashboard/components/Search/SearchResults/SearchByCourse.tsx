import { cn } from 'commons/utils';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BiCheck, BiChevronDown } from 'react-icons/bi';

const ALL_COURSE = { value: 'all', label: 'Semua Mata Kuliah' };

const SearchByCourse = (): JSX.Element => {
    const router = useRouter();
    const { course } = router.query as { course: string };

    const { courseOptions } = useGetPublicListCoursesV2Query(
        { limit: 100 },
        {
            selectFromResult: (result) => {
                const options =
                    result.data?.data.map((course) => ({
                        value: course.slug,
                        label: course.course_name
                    })) ?? [];
                return { courseOptions: [ALL_COURSE, ...options] as Option[] };
            }
        }
    );

    const defaultSelected = 'all';
    const selected = courseOptions
        ? courseOptions.find((option) =>
              course ? option.value == course : option.value == defaultSelected
          )
        : ALL_COURSE;

    return (
        <div className="flex-1 dropdown md:flex-none min-w-max">
            <button
                tabIndex={0}
                className="flex justify-between items-center gap-2 text-xs font-bold w-full md:w-52 pl-5 pr-3 py-3 bg-[#2C2C2C] rounded-full"
                aria-hidden>
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {selected?.label}
                </span>
                <BiChevronDown size={18} />
            </button>
            <ul
                tabIndex={0}
                role="menu"
                className={cn(
                    'dropdown-content menu overflow-clip mt-1 [&_li>*]:rounded-none w-full p-0 md:w-max md:min-w-52 bg-[#2C2C2C] text-xs rounded-lg z-10 divide-y divide-[#373737]'
                )}>
                {courseOptions.map(({ value, label }) => (
                    <li key={value}>
                        <Link
                            id={value}
                            className="flex justify-between items-center gap-3 px-[18px] py-[7.5px] border-t-[1px] border-[#373737] first:border-t-0"
                            href={{ query: { ...router.query, course: value } }}
                            replace
                            scroll={false}
                            aria-hidden>
                            {label}
                            <BiCheck
                                size={16}
                                className={cn(
                                    (!course && value == defaultSelected) ||
                                        course === value
                                        ? 'text-neutral-600'
                                        : 'text-transparent'
                                )}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchByCourse;
