import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export function useHandleSuccessfulForm() {
    const router = useRouter();

    const handleSuccessfulForm = () => {
        toast.success(`Perubahan berhasil disimpan`, {
            position: toast.POSITION.TOP_CENTER
        });
        router.push('/profil');
    };

    return { handleSuccessfulForm };
}
