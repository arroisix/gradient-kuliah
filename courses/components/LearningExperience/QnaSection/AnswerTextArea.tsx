import { useLearning } from 'courses/contexts/LearningProvider';
import { usePostAnswerMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';

import QnaTextArea from './TextArea';

interface QnaFormInputData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
}

const AnswerTextArea = ({
    questionId,
    onCancel
}: {
    questionId: string;
    onCancel: () => void;
}): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { subchapter } = useLearning();

    const [postAnswer, {}] = usePostAnswerMutation();

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
                    errors.content = 'Jawaban tidak boleh kosong';
                }

                return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
                const payload = {
                    ...values,
                    question_id: questionId
                };
                tracker?.trackAttemptFormSubmit(
                    'Answer on Video QnA',
                    payload,
                    {
                        'Course Slug': router.query.id,
                        'Video Title': subchapter?.subchapter_name
                    }
                );
                await postAnswer(payload);

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
                    key={`answer-${questionId}`}
                    className="flex justify-start gap-2"
                    onSubmit={handleSubmit}>
                    <QnaTextArea
                        placeholder="Tulis jawaban kamu disini..."
                        key={`answer-${questionId}`}
                        setFieldValue={setFieldValue}
                        onCancel={onCancel}
                        avatarSize="h-[45px] w-[45px]"
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

export default AnswerTextArea;
