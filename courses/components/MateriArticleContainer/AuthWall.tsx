import { RegistrationSection } from 'authentication/containers/RegistrationSection';

function AuthWall(): JSX.Element {
    return (
        <div className="fixed backdrop-blur-lg w-screen h-screen z-[10000] top-0 left-0">
            <div className="flex flex-col items-center justify-center w-screen h-screen">
                <div className="bg-neutral-900 px-8 py-8 rounded max-w-[450px] shadow-md relative">
                    <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                        Buat akun untuk lanjut belajar
                    </h2>
                    <RegistrationSection />
                </div>
            </div>
        </div>
    );
}

export default AuthWall;
