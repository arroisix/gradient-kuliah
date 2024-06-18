interface CodeEditorContextProps {
    setContainer: Dispatch<SetStateAction<HTMLDivElement | undefined>>;
    container: HTMLDivElement | null | undefined;
    controls: {
        run: () => void;
        stop: () => void;
        reset: () => void;
        insertCharacter: (char: string) => void;
    };
    output: {
        stdout: string;
        stderr: string;
    };
    isLoading: boolean;
    isRunning: boolean;
    isAutoSaving: boolean;
    isShowOutput: boolean;
}
