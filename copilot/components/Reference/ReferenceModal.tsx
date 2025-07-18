import { cn } from 'commons/utils';
import { IoMdClose } from 'react-icons/io';
import ReferenceRecommendationContainer from '../../containers/ReferenceRecommendationContainer';

interface ReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReferenceModal = ({ isOpen, onClose }: ReferenceModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#101010] flex flex-col pt-20 px-0 md:px-16">
            <div className="flex items-center justify-between px-8 flex-shrink-0">
                <h2 className="text-xl font-semibold text-white">Tambah Referensi</h2>
                <button
                    onClick={onClose}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                >
                    <IoMdClose size={24} />
                </button>
            </div>
            
            <div className="flex-1 min-h-0">
                <ReferenceRecommendationContainer className="px-8" />
            </div>
        </div>
    );
};

export default ReferenceModal;