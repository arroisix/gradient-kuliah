import { PythonProvider } from 'library/pyodide/providers/PythonProvider';
import React, { useEffect, useRef } from 'react';
import Controls from './Controls';
import { useCodeEditor } from 'courses/hooks/useCodeEditor';

const CodeEditor = (): JSX.Element => {
    const editor = useRef<HTMLDivElement | null>(null);
    const { setContainer, isShowOutput, output } = useCodeEditor();

    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }
    }, [editor.current]);

    return (
        <PythonProvider>
            <div className="flex flex-col">
                <div ref={editor} />
                <Controls />
                {isShowOutput && (
                    <pre className="w-full p-4 text-left whitespace-pre text-wrap">
                        <code>{output.stdout}</code>
                        <code className="text-error">{output.stderr}</code>
                    </pre>
                )}
            </div>
        </PythonProvider>
    );
};

export default CodeEditor;
