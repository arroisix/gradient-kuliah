export const flattenSubchapter = (subchapter: SubChapter): SubChapter[] => {
    const baseSubchapter = {
        id: subchapter.id,
        subchapter_name: subchapter.subchapter_name,
        order: subchapter.order
    };

    let videoSubchapter: SubChapter[] = [];
    let exercisesSubchapter: SubChapter[] = [];

    if (subchapter.video && !subchapter.video.is_animation) {
        videoSubchapter = [
            {
                ...baseSubchapter,
                video: subchapter.video
            }
        ];
    }

    if (subchapter?.exercises && subchapter?.exercises?.length > 0) {
        exercisesSubchapter = subchapter?.exercises?.map(
            (exercise: CourseExercise) => ({
                ...baseSubchapter,
                exercise: exercise
            })
        ) as SubChapter[];
    }

    return [...videoSubchapter, ...(exercisesSubchapter ?? [])];
};

export const getAllChapterContent = (chapters: Chapter[]): Chapter[] => {
    const contentChapters = chapters?.map((chapter) => {
        let res: SubChapter[] = [];

        chapter?.subchapters.forEach((subchapter: SubChapter) => {
            res = [...res, ...flattenSubchapter(subchapter)];
        });

        const uniqueRes = Array.from(new Set(res));

        return {
            ...chapter,
            subchapters: uniqueRes?.sort((sc1, sc2) => sc1.order - sc2.order)
        } as unknown as Chapter;
    });

    return (contentChapters as Chapter[])
        ?.sort((ch1: Chapter, ch2: Chapter) => ch1?.order - ch2?.order)
        .filter(
            (chapter: Chapter) =>
                chapter.subchapters.length > 0 || chapter.is_coming_soon_video
        );
};

export const getAllVideoChapter = (chapters: Chapter[]): Chapter[] => {
    const videoChapter = chapters?.map((chapter) => {
        const res = chapter?.subchapters
            ?.filter(
                (subchapter) =>
                    subchapter.video !== null && !subchapter.video?.is_animation
            )
            ?.map((subchapter) => {
                return {
                    ...subchapter,
                    notebook: null
                };
            })
            ?.sort((sc1, sc2) => sc1.order - sc2.order);

        return {
            ...chapter,
            subchapters: res
        } as unknown as Chapter;
    });

    return (videoChapter as [Chapter])
        ?.sort((ch1: Chapter, ch2: Chapter) => ch1?.order - ch2?.order)
        .filter(
            (chapter: Chapter) =>
                chapter.subchapters.length > 0 || chapter.is_coming_soon_video
        );
};

export const getAllNotebookChapter = (chapters: Chapter[]): Chapter[] => {
    const notebookChapter = chapters?.map((chapter) => {
        const res = chapter?.subchapters
            ?.filter((subchapter) => subchapter.notebook !== null)
            ?.map((subchapter) => {
                return {
                    ...subchapter,
                    video: null
                };
            })
            ?.sort((sc1, sc2) => sc1.order - sc2.order);

        return {
            ...chapter,
            subchapters: res
        } as unknown as Chapter;
    });

    return (notebookChapter as [Chapter])
        ?.sort((ch1: Chapter, ch2: Chapter) => ch1?.order - ch2?.order)
        .filter(
            (chapter: Chapter) =>
                chapter.subchapters.length > 0 ||
                chapter.is_coming_soon_notebook
        );
};

export const sortByOrder = (subchapter: SubChapter[]): SubChapter[] => {
    const tempUnsorted = [...subchapter];
    return tempUnsorted?.sort((sc1, sc2) => sc1?.order - sc2?.order);
};

export const isAnimationExist = (chapters: Chapter[]): boolean => {
    let isExist = false;
    chapters.forEach((chapter: Chapter) => {
        chapter.subchapters.forEach((subchapter: SubChapter) => {
            if (subchapter.video && subchapter.video.is_animation) {
                isExist = true;
                return;
            }
        });
    });

    return isExist;
};

export const isContentChapterExist = (
    chapters: Chapter[],
    type: 'notebook' | 'video'
): boolean => {
    let isExist = false;
    chapters?.forEach((chapter: Chapter) => {
        if (
            chapter?.subchapters?.filter(
                (subchapter: SubChapter) => subchapter[type] !== null
            ).length > 0
        ) {
            isExist = true;
            return;
        }
    });

    return isExist;
};

export const getAllAnimationChapter = (chapters: Chapter[]): Chapter[] => {
    const animationChapter = chapters.map((chapter: Chapter) => {
        const res = chapter.subchapters
            .filter((subchapter: SubChapter) => subchapter.video?.is_animation)
            .sort((sc1, sc2) => sc1.order - sc2.order);

        return {
            ...chapter,
            subchapters: res
        };
    });

    return (animationChapter as Chapter[])
        ?.sort((ch1: Chapter, ch2: Chapter) => ch1.order - ch2.order)
        .filter(
            (chapter: Chapter) =>
                chapter.subchapters.length > 0 ||
                chapter.is_coming_soon_animation
        );
};

// Create our number formatter.
export const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const dayToMonth = (day: number): string => {
    if (day >= 30) {
        return `${Math.floor(day / 30)} Bulan`;
    }

    return `${day} Hari`;
};

export const addZeroBefore = (data: number): string => {
    return `${data < 10 ? '0' : ''}${data}`;
};

export const getBookBaseHref = (book_category: string): string => {
    switch (book_category.toLowerCase()) {
        case 'textbook':
            return '/perpustakaan/textbook';
        case 'astronotes':
        case 'catatan':
            return '/perpustakaan/astronotes';
        default:
            return '/perpustakaan/bank-soal';
    }
};
