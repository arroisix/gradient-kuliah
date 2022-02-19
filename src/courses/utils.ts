export const getAllVideoChapter = (chapters: [Chapter]): [Chapter] => {
    const videoChapter = chapters.map((chapter) => {
        const res = chapter.subchapters
            .filter((subchapter) => subchapter.video !== null)
            .map((subchapter) => {
                return {
                    ...subchapter,
                    notebook: null
                };
            })
            .sort((sc1, sc2) => sc1.order - sc2.order);

        return {
            ...chapter,
            subchapters: res
        } as unknown as Chapter;
    });

    return (videoChapter as [Chapter]).sort(
        (ch1: Chapter, ch2: Chapter) => ch1.order - ch2.order
    );
};

export const getAllNotebookChapter = (chapters: [Chapter]): [Chapter] => {
    const notebookChapter = chapters.map((chapter) => {
        const res = chapter.subchapters
            .filter((subchapter) => subchapter.notebook !== null)
            .map((subchapter) => {
                return {
                    ...subchapter,
                    video: null
                };
            })
            .sort((sc1, sc2) => sc1.order - sc2.order);

        return {
            ...chapter,
            subchapters: res
        } as unknown as Chapter;
    });

    return (notebookChapter as [Chapter]).sort(
        (ch1: Chapter, ch2: Chapter) => ch1.order - ch2.order
    );
};
