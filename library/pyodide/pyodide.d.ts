interface Packages {
    official?: string[];
    micropip?: string[];
}

interface Runner {
    init: (
        stdout: (msg: string) => void,
        onLoad: ({
            id,
            version,
            banner
        }: {
            id: string;
            version: string;
            banner?: string;
        }) => void,
        packages?: string[][]
    ) => Promise<void>;
    interruptExecution: () => void;
    readFile: (name: string) => void;
    writeFile: (name: string, data: string) => void;
    mkdir: (name: string) => void;
    rmdir: (name: string) => void;
}

interface PythonRunner extends Runner {
    run: (code: string) => Promise<void>;
}

interface PythonConsoleRunner extends Runner {
    run: (code: string) => Promise<{ state: string; error?: string }>;
}
