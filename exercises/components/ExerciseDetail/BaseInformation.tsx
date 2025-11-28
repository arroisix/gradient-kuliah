import List from 'commons/components/elements/Icons/List';
import UniversityIcon from 'commons/components/elements/Icons/University';
import { cn } from 'commons/utils';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { Clock, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/router';
import { useWindowSize } from 'usehooks-ts';

const BaseInformation = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { width } = useWindowSize();

    const { data: exercise } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="w-full flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    {exercise?.tryout_type && (
                        <div className="rounded-lg py-1 px-3 bg-violet-3 border border-neutral-800">
                            <span className="text-xs font-bold">
                                {exercise?.tryout_type}
                            </span>
                        </div>
                    )}
                    {exercise?.exercise_code && (
                        <div className="rounded-lg py-1 px-3 border border-neutral-800">
                            <span className="text-xs font-bold">
                                Paket {exercise?.exercise_code}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    {exercise?.university_name && (
                        <div className="flex items-center gap-1 flex-wrap">
                            <UniversityIcon
                                color={exercise?.university_color}
                                size={14}
                            />
                            <span
                                className={cn('text-xs font-medium')}
                                style={
                                    exercise?.university_color
                                        ? {
                                              color: exercise?.university_color
                                          }
                                        : undefined
                                }>
                                {exercise.university_name}
                            </span>
                        </div>
                    )}
                    <h3 className="text-lg lg:text-2xl font-semibold text-white line-clamp-2">
                        {exercise?.title}
                    </h3>
                </div>
            </div>
            <div className="flex items-center gap-3 w-full">
                {exercise?.course.name && (
                    <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                        <GraduationCap
                            className="text-purple-6"
                            size={width < 768 ? 14 : 18}
                        />
                        <span className="text-xs md:text-sm text-purple-6 text-center">
                            {exercise.course.name}
                        </span>
                    </span>
                )}
                <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                    <List color="#7D89CC" size={width < 768 ? 14 : 18} />
                    <span className="text-xs md:text-sm text-purple-6 text-center">
                        {exercise?.total_problems} Soal
                    </span>
                </span>
                {(exercise?.total_duration as number) > 0 && (
                    <span className="flex items-center gap-1 flex-col py-3 flex-1 rounded-lg bg-violet-3">
                        <Clock size={width < 768 ? 14 : 18} color="#7D89CC" />
                        <span className="text-xs md:text-sm text-purple-6 text-center">
                            {(
                                (exercise?.total_duration as number) / 60
                            ).toFixed(0)}{' '}
                            Menit
                        </span>
                    </span>
                )}
            </div>
        </div>
    );
};

export default BaseInformation;
