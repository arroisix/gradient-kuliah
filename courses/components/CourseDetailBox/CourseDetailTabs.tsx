import { cn } from 'commons/utils';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import 'driver.js/dist/driver.css';
import useDriver from 'library/driver.js/useDriver';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { IoIosSearch, IoMdClose } from 'react-icons/io';
import { useTracker } from 'tracker/tracker';
import { useLocalStorage } from 'usehooks-ts';

type CourseDetailTabsProps = {
    navigation: CourseDetailNavigation;
    setNavigation: Dispatch<SetStateAction<CourseDetailNavigation>>;
};

const CourseDetailTabs = ({
    navigation,
    setNavigation
}: CourseDetailTabsProps): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { id } = router.query;
    const {
        isSearch,
        searchKeyword,
        setIsSearch,
        setSearchKeyword,
        handleSearch
    } = useSearchSubchapter();
    const { data: courseContent } = useGetCourseContentQuery(
        { slug: id as string },
        { skip: !id }
    );
    const { subchapter } = useLearning();

    const onSubmitSearch: UseSearchSubchapter['handleSearch'] = (
        params
    ): void => {
        handleSearch(params);
        setNavigation('ON_SEARCH');
    };
    const [tourViewed, setTourViewed] = useLocalStorage(
        'codeEditorTourViewed',
        false
    );
    const driver = useDriver({
        popoverClass: 'dashboard-tour code-editor',
        showButtons: ['next'],
        showProgress: false,
        progressText: '',
        doneBtnText: 'Coba',
        steps: [
            {
                element: '[data-tour="code-editor-tab"]',
                popover: {
                    description: 'Coba buat program Python di sini!',
                    side: 'bottom',
                    align: 'start'
                }
            }
        ],
        onPopoverRender: (popover) => {
            const skipButton = document.createElement('button');
            skipButton.innerText = 'Nanti Aja';
            skipButton.classList.add('secondary');
            popover.footerButtons.prepend(skipButton);

            skipButton.addEventListener('click', () => {
                driver.current?.destroy();
            });
        },
        onNextClick: () => {
            onChangeTab('CODE EDITOR', 'Click Code Editor Tab - LMS');
            driver.current?.destroy();
        },
        onDestroyed() {
            setTourViewed(true);
        }
    });

    const showTutorial = useCallback(() => {
        if (!tourViewed && subchapter?.video?.has_code_editor) {
            driver.current?.drive();
        }
    }, [tourViewed, driver]);

    useEffect(() => {
        setTimeout(() => showTutorial(), 5000);
    }, []);

    const onChangeTab = (
        to: CourseDetailNavigation,
        eventName: string
    ): void => {
        tracker?.genericTrack(eventName, {
            'Course Slug': id
        });
        setNavigation(to);
    };

    if (isSearch)
        return (
            <div className="flex items-center px-3 bg-[#212121] rounded-[100px] border-[1px] border-neutral-400">
                <IoIosSearch
                    size={20}
                    className="text-[#DADADA] cursor-pointer"
                    onClick={() => {
                        onSubmitSearch({});
                    }}
                />
                <input
                    className="w-full text-xs bg-transparent border-none font-body focus:outline-none focus:ring-0 focus:appearance-none"
                    type="text"
                    value={searchKeyword}
                    name="search"
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    onKeyDown={(event) => {
                        event.key === 'Enter' ? onSubmitSearch({}) : null;
                    }}
                />
                <IoMdClose
                    size={16}
                    className="text-white cursor-pointer"
                    onClick={() => {
                        setIsSearch(false);
                        setSearchKeyword('');
                        setNavigation('VIDEO');
                    }}
                />
            </div>
        );

    return (
        <div className="flex items-center justify-between px-5 md:px-16 lg:px-[14px] pt-[14px]">
            <div className="flex gap-4">
                <CourseDetailTab
                    label="VIDEO"
                    isActive={navigation === 'VIDEO'}
                    onClick={() =>
                        onChangeTab('VIDEO', 'Click Video Tab - LMS')
                    }
                />
                <CourseDetailTab
                    label="CODE EDITOR"
                    isHidden={!subchapter?.video?.has_code_editor}
                    isActive={navigation === 'CODE EDITOR'}
                    dataTour="code-editor-tab"
                    onClick={() =>
                        onChangeTab(
                            'CODE EDITOR',
                            'Click Code Editor Tab - LMS'
                        )
                    }
                />
                <CourseDetailTab
                    label="BUKU"
                    isHidden={courseContent?.books.length === 0}
                    isActive={navigation === 'BOOK'}
                    onClick={() => onChangeTab('BOOK', 'Click Book Tab - LMS')}
                />
            </div>
            <IoIosSearch
                size={20}
                className="text-[#DADADA] hover:text-white cursor-pointer"
                onClick={() => setIsSearch(true)}
            />
        </div>
    );
};

interface CourseDetailTabProps {
    isHidden?: boolean;
    isActive: boolean;
    onClick: () => void;
    label: string;
    dataTour?: string;
}

const CourseDetailTab = ({
    isActive,
    isHidden,
    onClick,
    dataTour,
    label
}: CourseDetailTabProps): JSX.Element => {
    if (isHidden) return <></>;
    return (
        <button
            className={cn(
                'font-bold text-sm pb-[6px] cursor-pointer',
                isActive
                    ? 'border-b-2 border-accent-purple'
                    : 'text-neutral-600 border-none hover:text-neutral-500'
            )}
            onClick={onClick}
            data-tour={dataTour}>
            {label}
        </button>
    );
};

export default CourseDetailTabs;
