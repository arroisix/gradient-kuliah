import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoPlayCircleOutline, IoLibrary, IoBookmark, IoSchool } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { BookText } from 'lucide-react';
import { SelectedReference, ReferenceContentType } from 'copilot/types/copilot';
import { cn } from 'commons/utils';

interface ReferenceContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedReferences: SelectedReference[];
    onRemoveReference: (referenceId: string, contentType: ReferenceContentType) => void;
    onOpenReferenceModal: () => void;
    isViewOnly?: boolean;
}

const ReferenceContentModal: React.FC<ReferenceContentModalProps> = ({
    isOpen,
    onClose,
    selectedReferences,
    onRemoveReference,
    onOpenReferenceModal,
    isViewOnly = false
}) => {
    if (!isOpen) return null;

    const getContentTypeIcon = (contentType: ReferenceContentType) => {
        switch (contentType) {
            case 'course':
                return <IoPlayCircleOutline size={36} className="text-white" />;
            default:
                return <BookText size={36} className="text-white" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-0 sm:items-center sm:justify-center sm:p-4">
            <div className="bg-[#1A1A1A] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] sm:mt-8 sm:max-h-[82vh] overflow-hidden">
                <div className="flex items-center justify-between pt-6 px-6">
                    <h2 className="text-lg font-semibold text-white">
                        {isViewOnly ? "Referensi Konten yang Digunakan" : "Referensi Konten"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                    >
                        <IoMdClose size={30} />
                    </button>
                </div>

                <div className="mx-6 mt-4 p-3 bg-[#252246] rounded-2xl border border-[#3A3F5C] border-b border-white/10">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 14.167V10M10 5.833H10.008M18.333 10C18.333 14.602 14.602 18.333 10 18.333C5.398 18.333 1.667 14.602 1.667 10C1.667 5.398 5.398 1.667 10 1.667C14.602 1.667 18.333 5.398 18.333 10Z" stroke="#7D89CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Referensi konten membantu Copilot AI menjawab pertanyaanmu sesuai konteks
                        </p>
                    </div>
                </div>

                <div className="px-6 pt-4 space-y-0 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
                    {selectedReferences.map((reference) => (
                        <div key={`${reference.id}-${reference.contentType}`}>
                            <div className="rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {getContentTypeIcon(reference.contentType)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white text-sm leading-tight mb-1">
                                                {reference.header || 'Content Item'}
                                            </h3>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1">
                                                    {reference.contentType === 'course' ? 
                                                        <IoSchool size={12} className="text-[#7D89CC]" /> : 
                                                        <IoLibrary size={12} className="text-[#7D89CC]" />
                                                    }
                                                    <span className="text-xs text-white/60">
                                                        {reference.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <IoBookmark size={12} className="text-[#7D89CC]" />
                                                    <span className="text-xs text-white/60">
                                                        {reference.subtitle}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => onRemoveReference(reference.id, reference.contentType)}
                                        className={cn(
                                            "p-1 text-white/40 hover:text-white/80 transition-colors flex-shrink-0 ml-2",
                                            isViewOnly && "hidden"
                                        )}
                                        aria-label="Remove reference"
                                    >
                                        <IoMdClose size={26} />
                                    </button>
                                </div>
                            </div>
                            <div className="border-b border-white/10 mx-4"></div>
                        </div>
                    ))}
                </div>

                <div className={cn("p-6", isViewOnly && "hidden")}>
                    <button
                        onClick={onOpenReferenceModal}
                        className="w-full bg-[#333333] text-white/80 hover:text-white py-3 px-4 rounded-full transition-colors flex items-center justify-center gap-2"
                    >
                        <IoSearchOutline size={16} />
                        <span className="font-bold">Tambah Referensi</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferenceContentModal;