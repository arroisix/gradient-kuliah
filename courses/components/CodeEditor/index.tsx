import { PythonProvider } from 'library/pyodide/providers/PythonProvider';
import React, { useEffect, useRef } from 'react';
import Controls from './Controls';
import { useCodeEditor } from 'courses/hooks/useCodeEditor';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CTAOverlay from './CtaOverlay';

const CodeEditor = (): JSX.Element => {
    const editor = useRef<HTMLDivElement | null>(null);
    const { setContainer, isShowOutput, output, container } = useCodeEditor();
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
            editor.current.focus()
        }
    }, [editor.current]);

    const focusedEditor = () => {
        if (container) container.focus()
    }

    return (
        <PythonProvider>
            <div className="flex flex-col relative">
                <div ref={editor} onBlur={focusedEditor} />
                <Controls />
                {isShowOutput && (
                    <pre className="w-full p-4 text-left whitespace-pre text-wrap overflow-x-auto">
                        <code>{output.stdout}</code>
                        <code className="text-error">{output.stderr}</code>
                    </pre>
                )}
                
                {!isAuthenticated && <CTAOverlay />}
            </div>
        </PythonProvider>
    );
};

export default CodeEditor;
