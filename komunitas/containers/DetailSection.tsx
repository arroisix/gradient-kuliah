import AnswerCard from 'komunitas/components/AnswerCard';
import QuestionCard from 'komunitas/components/QuestionCard';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';

const DUMMY_SIMILIAR = {
    questions: [
        {
            id: '12312373',
            content: 'Ada yang ngerti turunan integrsdajkhd'
        },
        {
            id: '231731973',
            content: 'kajd asdjas ldaldjad alda'
        },
        {
            id: '1731973',
            content: 'satu tambah satu berapa ya?'
        },
        {
            id: '31731973',
            content: 'ku tak tau mau mu apa'
        },
        {
            id: '1233',
            content: 'are u okeh?'
        },
        {
            id: '121973',
            content: 'okh mas'
        },
        {
            id: '1233',
            content: 'halo alo hahahah ihiy'
        }
    ]
};

const DUMMY_QUESTION = {
    id: '1',
    content: 'aps kabars bangs',
    viewer_counts: 8,
    comment_counts: 3,
    created_at: 1687229985,
    course_name: 'bahasa indonesia',
    user: {
        id: '4',
        photo_url: '',
        username: 'irfan.kamil'
    }
};

const DUMMY_ANSWER = {
    comments: [
        {
            id: '45',
            content: 'baik bangs',
            comment_counts: 2,
            created_at: 4087229405,
            user: {
                id: '5',
                photo_url: '',
                username: 'kamil.irfan',
                is_expert: true
            }
        },
        {
            id: '4128',
            content: 'Aku expert bang',
            comment_counts: 0,
            created_at: 1687229985,
            user: {
                id: '5',
                photo_url: '',
                username: 'irfan.kamil',
                is_expert: true
            }
        },
        {
            id: '451',
            content: 'Keren kamu bang',
            comment_counts: 0,
            created_at: 1687229985,
            user: {
                id: '5',
                photo_url: '',
                username: 'irpan.k',
                is_expert: false
            }
        }
    ],
    total_items: 10,
    current_page: 10,
    items_per_page: 10
};

const DetailSection = (): JSX.Element => {
    return (
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12 flex flex-col gap-9">
                <div>
                    <h3 className="font-bold text-sm pb-5">Pertanyaan</h3>
                    <QuestionCard {...DUMMY_QUESTION} clickable={false} />
                </div>
                <div>
                    <h3 className="font-bold text-sm pb-5">Jawaban</h3>
                    <div className="flex flex-col gap-[18px]">
                        {DUMMY_ANSWER?.comments?.map((value) => (
                            <AnswerCard
                                key={value.id}
                                {...value}
                                isExpert={
                                    DUMMY_QUESTION.user.username !==
                                        value.user.username &&
                                    value.user.is_expert
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="relative w-screen md:w-full lg:w-4/12 h-[350px] bg-[#121212] ml-[-16px] mb-[-40px] md:m-0 px-[18px] py-5 md:rounded-lg overflow-hidden">
                <h4 className="font-extrabold pb-[20px]">Pertanyaan Serupa</h4>
                <div className="flex flex-col gap-2 px-[10px] py-[10px] bg-[#1D1D1D] rounded">
                    {DUMMY_SIMILIAR?.questions?.map(({ id, content }) => (
                        <Link key={id} href={`/komunitas/${id}`}>
                            <div className="flex justify-between items-center gap-2 py-1 cursor-pointer z-[1]">
                                <span className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                                    {content}
                                </span>
                                <div>
                                    <MdChevronRight
                                        className="text-neutral-600"
                                        size={18}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="absolute w-full h-full left-0 top-0">
                    <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[#121212] to-[#121212] z-[1]"></div>
                    <div className="absolute bottom-0 left-0 w-full px-[18px] z-[1]">
                        <Link href={'/komunitas'}>
                            <button className="bg-neutral-800 font-extrabold text-xs w-full py-2 rounded-[70px]">
                                Lihat di Komunitas
                            </button>
                        </Link>
                        <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailSection;
