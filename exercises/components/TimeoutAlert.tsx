import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import { useFinishUserProblemSetMutation } from 'exercises/redux/api/exercisesApi';
import {
    ExerciseDetail,
    ProblemInProblemSet,
    ProblemNavigationItem
} from 'exercises/types/exercises';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useWindowSize } from 'usehooks-ts';

interface TimeoutAlertProps {
    exercise: ExerciseDetail | undefined;
    problem: ProblemInProblemSet | undefined;
    firstProblem: ListResponseData<ProblemNavigationItem> | undefined;
    setIsTimeoutAlert: Dispatch<SetStateAction<boolean>>;
}

function TimeoutAlert({
    exercise,
    problem,
    firstProblem,
    setIsTimeoutAlert
}: TimeoutAlertProps): JSX.Element {
    const { width } = useWindowSize();
    const router = useRouter();
    const { slug, sectionId, problemId } = router.query;

    const [redirectionURL, setRedirectionURL] = useState('');
    const [submitProblemset] = useFinishUserProblemSetMutation();

    const handleClick = () => {
        setIsTimeoutAlert(false);
        router.push(redirectionURL, undefined, {
            scroll: false,
            shallow: true
        });
    };

    useEffect(() => {
        (async () => {
            try {
                const result = await submitProblemset({
                    slug: slug as string,
                    problemset_progress_id: problem?.id ?? '',
                    subchapter_slug:
                        exercise?.course.subchapter_slug ?? undefined
                }).unwrap();

                if (!result.is_show_solution) {
                    if (result.next_problemset_id) {
                        setRedirectionURL(
                            `/latihan/${slug}/${result.next_problemset_id}`
                        );
                    } else {
                        if (!exercise?.latest_exercise_progress?.id) {
                            const url =
                                exercise?.tryout_type === 'MATERI'
                                    ? `/utbk/materi/${exercise.course.slug}/${exercise.course.chapter_slug}/${exercise.course.subchapter_slug}`
                                    : `/latihan/${slug}`;

                            setRedirectionURL(url);
                        } else {
                            setRedirectionURL(
                                `/latihan/${slug}/report/${exercise?.latest_exercise_progress?.id}`
                            );
                        }
                    }
                } else {
                    // Handle showing solution for the problem set if needed
                    if (problem?.show_solution === 'AFTER_COMPLETE') {
                        setRedirectionURL(
                            `/latihan/${slug}/${sectionId}/${firstProblem?.data[0].id}?solution=1`
                        );
                    } else {
                        setRedirectionURL(
                            `/latihan/${slug}/${sectionId}/${problemId}?solution=1`
                        );
                    }
                }
            } catch (error) {
                console.error(
                    new Error('failed to submit problem set', { cause: error })
                );
                toast.error(
                    'Terjadi kesalahan saat mengirim jawaban, silakan refresh halaman',
                    {
                        position: 'top-center',
                        theme: 'colored',
                        hideProgressBar: true
                    }
                );
            }
        })();
    }, []);

    if (!width) {
        return <></>;
    }

    if (width < 1024) {
        return (
            <Modal
                isOpen={true}
                setOpen={() => undefined}
                permanent={true}
                variant="dark"
                containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]">
                <div>
                    <div className="w-fit mx-auto mb-5">
                        <Image
                            src={`${CDN_URL}/assets/timeout_alert_icon.png`}
                            width={160}
                            height={160}
                            alt=""
                        />
                    </div>

                    <h2 className="text-white font-bold text-center mb-2">
                        Waktu Habis
                    </h2>

                    <p className="text-[#999999] text-center text-sm w-full max-w-72 mx-auto mb-6">
                        Waktu kamu telah habis, silakan klik untuk melanjutkan.
                    </p>

                    <Button
                        disabled={!redirectionURL}
                        onClick={() =>
                            router.push(redirectionURL, undefined, {
                                scroll: false,
                                shallow: true
                            })
                        }
                        type="button"
                        variant="secondary"
                        className="text-white font-semibold w-full !py-3">
                        {redirectionURL ? 'Lanjutkan' : 'Loading...'}
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <div className="absolute z-10 w-screen h-[calc(100vh-48px)] bg-black/80">
            <div className="bg-[#1D1D1D] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-lg rounded-2xl p-8">
                <div className="w-fit mx-auto mb-6">
                    <Image
                        src={`${CDN_URL}/assets/timeout_alert_icon.png`}
                        width={120}
                        height={120}
                        alt=""
                    />
                </div>

                <h2 className="text-white font-bold text-center leading-tight text-xl mb-3">
                    Waktu Habis
                </h2>

                <p className="text-[#999999] text-center leading-normal mb-6 w-full max-w-[400px] mx-auto">
                    Waktu kamu telah habis, silakan klik untuk melanjutkan.
                </p>

                <Button
                    disabled={!redirectionURL}
                    onClick={handleClick}
                    type="button"
                    variant="secondary"
                    className="text-white font-semibold block !py-3 w-full lg:max-w-[265px] lg:mx-auto">
                    {redirectionURL ? 'Lanjutkan' : 'Loading...'}
                </Button>
            </div>
        </div>
    );
}

export default TimeoutAlert;
