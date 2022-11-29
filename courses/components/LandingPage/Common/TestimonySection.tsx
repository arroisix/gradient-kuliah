import Image from 'next/image';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonyCard = ({
    testimony,
    name,
    role,
    photo
}: TestimonyData): JSX.Element => {
    return (
        <div className="w-[320px] border-[#666666] rounded-lg border h-[300px] flex flex-col justify-between p-4">
            <div>
                <FaQuoteLeft className="text-xl text-neutral-500 mb-2" />
                <span className="font-body text-[14px]">{testimony}</span>
            </div>
            <div className="flex w-full items-center">
                <div className="h-14 w-14 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                    <Image
                        loading="lazy"
                        src={photo}
                        height={56}
                        width={56}
                        className="object-cover"
                        alt="lecturer"
                    />
                </div>
                <div className="ml-2">
                    <h5 className="text-xs text-white font-bold">{name}</h5>
                    <h5 className="text-[11px] font-thin text-neutral-400 font-body">
                        {role}
                    </h5>
                </div>
            </div>
        </div>
    );
};

const TestimonySection = ({
    content
}: {
    content?: TestimonyData[];
}): JSX.Element => {
    return (
        <div className="pl-4 md:pl-[7.5rem] py-4">
            <h3 className="text-2xl md:text-4xl font-bold">Kata Mereka</h3>
            <div className="w-full py-4 overflow-x-auto">
                <div className="w-[1400px] flex gap-8">
                    {content?.map((testimony: TestimonyData) => (
                        <TestimonyCard
                            testimony={testimony.testimony}
                            photo={testimony.photo}
                            name={testimony.name}
                            role={testimony.role}
                            key={testimony.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonySection;
