import { PythonProvider } from 'library/pyodide/providers/PythonProvider';
import React, { useEffect, useRef } from 'react';
import Controls from './Controls';
import { useCodeEditor } from 'courses/hooks/useCodeEditor';
import CtaOverlay from './CtaOverlay';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

const CodeEditor = (): JSX.Element => {
    const editor = useRef<HTMLDivElement | null>(null);
    const { setContainer, isShowOutput, output } = useCodeEditor();
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }
    }, [editor.current]);

    return (
        <PythonProvider>
            <div className="flex flex-col relative">
                <div ref={editor} />
                <Controls />
                {isShowOutput && (
                    <pre className="w-full p-4 text-left whitespace-pre text-wrap">
                        <code>{output.stdout}</code>
                        <code className="text-error">{output.stderr}</code>
                    </pre>
                )}
                
                {!isAuthenticated && <CtaOverlay />}
            </div>
        </PythonProvider>
    );
};

export default CodeEditor;
