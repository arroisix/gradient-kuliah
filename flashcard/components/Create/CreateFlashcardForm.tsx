import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoClose, IoInformationCircle, IoAttach } from 'react-icons/io5';
import { Switch } from '@headlessui/react';
import { RiRobot2Fill } from 'react-icons/ri';
import {
    AiOutlineFilePdf,
    AiOutlineFileWord,
    AiOutlineFileImage
} from 'react-icons/ai';
import {
    useCreateFlashcardCopilotMutation,
    useCreateFlashcardMutation,
    useEditFlashcardMutation
} from '../../redux/api/flashcardsApi';
import { toast } from 'react-toastify';
import useUploadFile from 'commons/hooks/useUploadFile';

interface FileWithPreview extends File {
    preview?: string;
}

interface FormData {
    title: string;
    description: string;
    files: FileWithPreview[];
    isPrivate: boolean;
}

interface CreateFlashcardFormProps {
    useAi: boolean;
    mode?: 'create' | 'edit';
    initialData?: {
        id: string;
        slug: string;
        title: string;
        description: string;
        is_private: boolean;
    };
}

const CreateFlashcardForm = ({
    useAi = false,
    mode = 'create',
    initialData
}: CreateFlashcardFormProps): JSX.Element => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        files: [],
        isPrivate: false
    });
    const { uploadFile } = useUploadFile('flashcards');
    const [createFlashcardCopilot] = useCreateFlashcardCopilotMutation();

    const [createFlashcard, { isLoading: isCreateLoading }] =
        useCreateFlashcardMutation();
    const [editFlashcard, { isLoading: isEditLoading }] =
        useEditFlashcardMutation();

    const isLoading = isCreateLoading || isEditLoading;

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                files: [],
                isPrivate: initialData.is_private
            });
        }
    }, [mode, initialData]);

    const handleClose = () => {
        if (mode === 'edit' && initialData) {
            router.push(`/flashcard/${initialData.slug}`);
        } else {
            router.push('/flashcard');
        }
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            toast.error('Judul flashcard harus diisi', {
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }

        if (!formData.description.trim()) {
            if (useAi) {
                toast.error(
                    'Deskripsi wajib diisi agar penyusunan flashcard sesuai konteks',
                    {
                        position: toast.POSITION.TOP_CENTER
                    }
                );
            } else {
                toast.error('Deskripsi flashcard harus diisi', {
                    position: toast.POSITION.TOP_CENTER
                });
            }
            return false;
        }

        if (useAi && formData.files.length === 0) {
            toast.error('Silakan upload minimal 1 file referensi', {
                position: toast.POSITION.TOP_CENTER
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (mode === 'edit' && initialData) {
                await editFlashcard({
                    flashcard_slug: initialData.slug,
                    title: formData.title,
                    description: formData.description,
                    is_private: formData.isPrivate
                }).unwrap();

                toast.success('Detail flashcard diperbarui', {
                    position: toast.POSITION.TOP_CENTER
                });

                router.push(`/flashcard/${initialData.slug}`);
            } else {
                if (useAi) {
                    const uploadedUrls = await uploadFile(formData.files);

                    if (!uploadedUrls || uploadedUrls.length === 0) {
                        throw new Error('Failed to upload files');
                    }

                    const transformedUrls = uploadedUrls.map((url) => {
                        const match = url.match(/\.com\/(.*)/);
                        return match ? match[1] : url;
                    });

                    const response = await createFlashcardCopilot({
                        title: formData.title,
                        description: formData.description,
                        is_private: formData.isPrivate,
                        file_sources: transformedUrls
                    }).unwrap();

                    if (response?.slug) {
                        router.push(`/flashcard/${response.slug}`);
                    } else {
                        router.push('/flashcard');
                    }
                } else {
                    const response = await createFlashcard({
                        title: formData.title,
                        description: formData.description,
                        is_private: formData.isPrivate
                    }).unwrap();

                    toast.success('Flashcard berhasil dibuat', {
                        position: toast.POSITION.TOP_CENTER
                    });

                    if (response?.slug) {
                        router.push(`/flashcard/${response.slug}`);
                    } else {
                        router.push('/flashcard');
                    }
                }
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat membuat flashcard', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const MAX_FILE_SIZE = 10 * 1024 * 1024;
            const newFiles = Array.from(e.target.files) as FileWithPreview[];

            const oversizedFiles = newFiles.filter(
                (file) => file.size > MAX_FILE_SIZE
            );
            if (oversizedFiles.length > 0) {
                toast.error('File tidak boleh lebih dari 10MB', {
                    position: toast.POSITION.TOP_CENTER
                });
                return;
            }

            setFormData((prev) => ({
                ...prev,
                files: [...prev.files, ...newFiles].slice(0, 3)
            }));
        }
    };

    const removeFile = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            files: prev.files.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleToggle = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isPrivate: checked }));
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) {
            return {
                icon: <AiOutlineFilePdf className="text-red-500" size={20} />,
                label: 'PDF'
            };
        }
        if (fileType.includes('doc') || fileType.includes('word')) {
            return {
                icon: <AiOutlineFileWord className="text-blue-500" size={20} />,
                label: 'DOC'
            };
        }
        if (fileType.includes('image')) {
            return {
                icon: (
                    <AiOutlineFileImage className="text-gray-500" size={20} />
                ),
                label: 'JPG'
            };
        }
        return {
            icon: <IoAttach className="text-gray-500" size={20} />,
            label: fileType.toUpperCase()
        };
    };

    return (
        <div className="relative min-h-screen md:min-h-0 md:h-full">
            <div className="pt-4 pb-24 md:p-0">
                <div className="mb-6">
                    <div className="flex justify-end">
                        <button
                            onClick={handleClose}
                            className="text-neutral-400 hover:text-white">
                            <IoClose size={24} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {useAi && (
                            <div className="inline-flex items-center gap-2 bg-[#2F2B43] w-fit px-3 py-1 rounded-full md:hidden">
                                <RiRobot2Fill
                                    size={20}
                                    className="text-[#7D89CC]"
                                />
                                <span className="text-white font-medium">
                                    Copilot AI
                                </span>
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-white">
                            {mode === 'edit'
                                ? 'Edit Flashcard'
                                : 'Buat Flashcard'}
                        </h1>
                    </div>
                </div>

                <form
                    id="flashcardForm"
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm text-neutral-400">
                            Judul
                        </label>
                        <input
                            type="text"
                            placeholder="Judul flashcard"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: e.target.value
                                }))
                            }
                            className="w-full bg-[#222222] border-none rounded-lg py-3 px-4 text-white placeholder:text-neutral-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-neutral-400">
                            Deskripsi
                        </label>
                        <div className="relative">
                            <textarea
                                placeholder="Deskripsi flashcard"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value
                                    }))
                                }
                                maxLength={500}
                                rows={4}
                                className="w-full bg-[#222222] border-none rounded-lg py-3 px-4 text-white placeholder:text-neutral-500 resize-none"
                            />
                            <span className="absolute right-2 bottom-2 text-xs text-neutral-400">
                                {formData.description.length}/500
                            </span>
                        </div>
                        {useAi && (
                            <div className="flex items-start gap-2 p-4 rounded-lg bg-[#252246]">
                                <IoInformationCircle
                                    size={20}
                                    className="text-[#7D89CC] flex-shrink-0 mt-0.5"
                                />
                                <p className="text-sm text-neutral-400">
                                    <span className="md:hidden">
                                        Deskripsi membantu Copilot AI menyusun
                                        flashcard yang sesuai konteks
                                    </span>
                                    <span className="hidden md:inline">
                                        Deskripsi membantu Copilot AI menyusun
                                        flashcard yang sesuai konteks
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                    {useAi && (
                        <div className="space-y-2">
                            <label className="block text-sm text-neutral-400">
                                Referensi (Maks. 3)
                            </label>
                            <div className="space-y-2">
                                {formData.files.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto md:grid md:grid-cols-3 pb-2 md:pb-0">
                                        {formData.files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative bg-[#222222] rounded-lg p-3 flex-shrink-0 w-60 md:w-auto">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="absolute -right-2 -top-2 w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-white">
                                                    <IoClose size={14} />
                                                </button>
                                                <div className="flex items-center gap-3">
                                                    {
                                                        getFileIcon(file.type)
                                                            .icon
                                                    }
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-sm text-white truncate max-w-[180px] md:max-w-none">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-xs text-neutral-500">
                                                            {
                                                                getFileIcon(
                                                                    file.type
                                                                ).label
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {formData.files.length < 3 && (
                                    <div>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center gap-2 w-full bg-[#222222] border-none rounded-lg py-3 px-4 text-neutral-500 cursor-pointer">
                                            <IoAttach
                                                size={20}
                                                className="flex-shrink-0"
                                            />
                                            <span>
                                                Upload file (PDF, JPG, Docx)
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-white">
                            Buat akses ke flashcard rahasia?
                        </span>
                        <Switch
                            checked={formData.isPrivate}
                            onChange={handleToggle}
                            className={`${
                                formData.isPrivate
                                    ? 'bg-[#03AC5C]'
                                    : 'bg-neutral-700'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                            <span
                                className={`${
                                    formData.isPrivate
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                    </div>
                </form>
            </div>

            <div className="md:flex md:justify-end md:gap-3 md:mt-6 md:pb-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="hidden md:block w-[140px] px-5 py-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors text-base font-semibold">
                    Kembali
                </button>
                <button
                    type="submit"
                    form="flashcardForm"
                    disabled={isLoading}
                    className="fixed md:static bottom-4 left-4 right-4 w-[calc(100%-32px)] md:w-[140px] px-5 py-3 rounded-[14px] md:rounded-full bg-[#5F2BCE] text-white hover:opacity-90 transition-colors text-base font-semibold disabled:opacity-50">
                    <div className="flex items-center justify-center gap-2">
                        {isLoading && (
                            <span className="loading loading-spinner loading-sm" />
                        )}
                        <span>
                            {isLoading
                                ? 'Loading...'
                                : mode === 'edit'
                                ? 'Simpan'
                                : 'Buat'}
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default CreateFlashcardForm;
