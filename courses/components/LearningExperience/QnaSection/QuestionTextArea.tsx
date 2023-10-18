import { useLearning } from 'courses/contexts/LearningProvider';
import { usePostQuestionMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik, FormikConfig } from 'formik';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';

import QnaTextArea from './QnaTextArea';

interface QnaFormInputData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
}

const INITIAL_VALUE: QnaFormInputData = {
    content: '',
    attachment: '',
    is_anonymous: false
};

const QuestionTextArea = (): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { video, subchapter } = useLearning();
    const [postQuestion, {}] = usePostQuestionMutation();

    const validate = (values: QnaFormInputData): QnaFormInputData => {
        const errors = {} as QnaFormInputData;
        if (values.content.length <= 0) {
            errors.content = 'Pertanyaan tidak boleh kosong';
        }

        return errors;
    };

    const handleSubmit: FormikConfig<QnaFormInputData>['onSubmit'] = async (
        values,
        { resetForm }
    ) => {
        const payload = {
            ...values,
            video_id: video.id
        };
        tracker?.trackAttemptFormSubmit('Question on Video QnA', payload, {
            'Course Slug': router.query.id,
            'Video Title': subchapter?.subchapter_name
        });
        await postQuestion(payload);

        resetForm({
            values: INITIAL_VALUE
        });
    };

    return (
        <Formik
            initialValues={INITIAL_VALUE}
            validate={validate}
            onSubmit={handleSubmit}>
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
