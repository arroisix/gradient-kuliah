import { usePostAnswerMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik } from 'formik';

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
                await postAnswer({
                    ...values,
                    question_id: questionId
                });

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
