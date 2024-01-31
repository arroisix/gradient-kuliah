import { python } from '@codemirror/lang-python';
import { indentUnit } from '@codemirror/language';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import { useCodeMirror } from '@uiw/react-codemirror';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useLearning } from 'courses/contexts/LearningProvider';
import {
    useGetCodingProgressQuery,
    useTrackCodingProgressMutation
} from 'courses/redux/api/learningExperienceApi';
import { useGetPrivateCodeEditorTemplateQuery } from 'courses/redux/api/privateCourseApi';
import { useGetPublicCodeEditorTemplateQuery } from 'courses/redux/api/publicCourseApi';
import usePython from 'library/pyodide/hooks/usePython';
import { useRouter } from 'next/router';
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

const CodeEditorContext = createContext<CodeEditorContextProps | undefined>(
    undefined
);

const PYTHON_EXTENSIONS = [python(), indentUnit.of('    ')];
const THEME = vscodeDarkInit({
    settings: {
        background: '#121212',
        gutterBackground: '#121212',
        gutterForeground: '#666666'
    }
});

export const CodeEditorProvider = ({
    children
}: PropsWithChildren): JSX.Element => {
    const router = useRouter();
    const { sub } = router.query;

    const [code, setCode] = useState<string>('');
    const [autosavedCode] = useDebounce(code, 30 * 1000, {
        maxWait: 60 * 1000 // delays save by 30s, hits BE after 60s
    });
    const [isShowOutput, setIsShowOutput] = useState<boolean>(false);

    const [track, { isLoading: isAutoSaving }] =
        useTrackCodingProgressMutation();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { video, latest_watch_video, is_subscribed } = useLearning();
    const {
        runPython,
        stdout,
        stderr,
        isLoading,
        isRunning,
        interruptExecution
    } = usePython();

    const privateCodeEditorTemplate = useGetPrivateCodeEditorTemplateQuery(
        video ? video.id : skipToken,
        { skip: !video?.has_code_editor || !sub || !isAuthenticated }
    );
    const publicCodeEditorTemplate = useGetPublicCodeEditorTemplateQuery(
        video ? video.id : skipToken,
        { skip: !video?.has_code_editor || !sub || isAuthenticated }
    );
    const { data: codeEditorTemplate } = isAuthenticated
        ? privateCodeEditorTemplate
        : publicCodeEditorTemplate;

    const skipGetCodingProgress =
        !codeEditorTemplate ||
        !video?.has_code_editor ||
        !latest_watch_video?.video.id ||
        !sub ||
        !isAuthenticated;
    const { data: codingProgress } = useGetCodingProgressQuery(
        {
            watch_progress_id: latest_watch_video?.video.id as string,
            code_editor_id: codeEditorTemplate?.id as string
        },
        { skip: skipGetCodingProgress }
    );

    useEffect(() => {
        if (!codingProgress && isAuthenticated) {
            return;
        }

        const latestCodeProgress = codingProgress?.latest_code;
        if (latestCodeProgress && latestCodeProgress != autosavedCode) {
            setCode(latestCodeProgress);
        } else if (!code) {
            setCode(codeEditorTemplate?.code_template as string);
        }
    }, [codeEditorTemplate, codingProgress]);

    useEffect(() => {
        trackUserCodingProgress(autosavedCode);
    }, [autosavedCode]);

    const { view, setContainer } = useCodeMirror({
        value: code,
        onChange: setCode,
        theme: THEME,
        extensions: PYTHON_EXTENSIONS,
        height: '300px'
    });

    const trackUserCodingProgress = (latestCode: string): void => {
        if (is_subscribed && latestCode) {
            track({
                coding_progress_id: codingProgress?.id as string,
                latest_code: latestCode
            });
        }
    };

    const run = (): void => {
        if (!video?.has_code_editor) {
            toast.error('Terjadi kesalahan saat menjalankan kode.');
        } else {
            trackUserCodingProgress(code);
            runPython(code);
            setIsShowOutput(true);
        }
    };

    const stop = (): void => {
        interruptExecution();
        setIsShowOutput(false);
    };

    const reset = (): void => {
        setIsShowOutput(false);
        setCode(codeEditorTemplate?.code_template as string);
    };

    const insertCharacter = (char: string): void => {
        if (!view) return;
        const range = view.state.selection.main;
        view.dispatch({
            changes: {
                from: range?.from,
                to: range?.to,
                insert: char
            },
            selection: { anchor: range?.from + 1 }
        });
    };

    return (
        <CodeEditorContext.Provider
            value={{
                setContainer,
                controls: {
                    run,
                    stop,
                    reset,
                    insertCharacter
                },
                output: {
                    stdout,
                    stderr
                },
                isLoading,
                isRunning,
                isAutoSaving,
                isShowOutput
            }}>
            {children}
        </CodeEditorContext.Provider>
    );
};

export const useCodeEditor = (): CodeEditorContextProps => {
    const context = useContext(CodeEditorContext);

    if (!context) {
        throw new Error(
            'useCodeEditor must be used within a CodeEditorContextProvider'
        );
    }

    return context;
};
