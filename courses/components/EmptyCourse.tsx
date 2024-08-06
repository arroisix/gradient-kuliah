import Image from 'next/image';
import emptyCourse from '../assets/images/emptyCourse.svg';

export default function EmptyCourse(): JSX.Element {
    return (
        <div className="pt-20">
            <div className="flex justify-center">
                <Image priority src={emptyCourse} />
            </div>
            <p className="mt-6 text-lg text-center font-semibold text-white">
                Tidak ada kelas yang sesuai
            </p>
        </div>
    );
}
