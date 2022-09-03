export const getAllVideoChapter = (chapters: Chapter[]): [Chapter] => {
    const videoChapter = chapters?.map((chapter) => {
        const res = chapter?.subchapters
            ?.filter((subchapter) => subchapter.video !== null)
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

    return (videoChapter as [Chapter])?.sort(
        (ch1: Chapter, ch2: Chapter) => ch1.order - ch2.order
    );
};

export const isContentChapterExist = (
    chapters: Chapter[],
    type: 'notebook' | 'video'
): boolean => {
    let isExist = false;
    chapters?.forEach((chapter: Chapter) => {
        if (
            chapter.subchapters.filter(
                (subchapter: SubChapter) => subchapter[type] !== null
            ).length > 0
        ) {
            isExist = true;
            return;
        }
    });

    return isExist;
};

export const getAllNotebookChapter = (chapters: Chapter[]): [Chapter] => {
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

    return (notebookChapter as [Chapter])?.sort(
        (ch1: Chapter, ch2: Chapter) => ch1.order - ch2.order
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
