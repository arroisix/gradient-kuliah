import Image from 'next/image';
import emptyCourse from '../assets/images/emptyCourse.svg';

export default function EmptyCourse() {
    return (
        <div className="pt-20">
            <div className="flex justify-center">
                <Image priority src={emptyCourse} />
            </div>
            <p className="mt-6 text-white text-lg font-semibold">
                Tidak ada kelas yang sesuai
            </p>
        </div>
    );
}
