import { useLearning } from 'courses/contexts/LearningProvider';
import { usePostQuestionMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';

import QnaTextArea from './TextArea';

interface QnaFormInputData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
}

const QuestionTextArea = (): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { video, subchapter } = useLearning();
    const [postQuestion, {}] = usePostQuestionMutation();

    return (
        <Formik
            initialValues={{
                content: '',
                attachment: '',
                is_anonymous: false
            }}
            validate={(values: QnaFormInputData) => {
                const errors = {} as QnaFormInputData;
                if (values.content.length <= 0) {
                    errors.content = 'Pertanyaan tidak boleh kosong';
                }

                return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
                const payload = {
                    ...values,
                    video_id: video.id
                };
                tracker?.trackAttemptFormSubmit(
                    'Question on Video QnA',
                    payload,
                    {
                        'Course Slug': router.query.id,
                        'Video Title': subchapter?.subchapter_name
                    }
                );
                await postQuestion(payload);

                resetForm({
                    values: {
                        content: '',
                        attachment: '',
                        is_anonymous: false
                    }
                });
            }}>
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                isValid,
                values
            }) => (
                <form
                    className="flex justify-start gap-2"
                    onSubmit={handleSubmit}>
                    <QnaTextArea
                        placeholder="Punya pertanyaan terkait materi?"
                        key="question"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        values={values}
                        disabled={isSubmitting || !isValid}
                    />
                </form>
            )}
        </Formik>
    );
};

export default QuestionTextArea;
