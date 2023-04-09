import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFormik, FormikConfig, FormikValues } from 'formik';

type FormikMultiStepConfig<Values extends FormikValues> =
  FormikConfig<Values> & {
    steps: FormikConfig<Values>['validationSchema'][];
  };

export default function useFormikMultiStep<Values extends FormikValues>({
  steps,
  onSubmit,
  initialValues,
  ...rest
}: FormikMultiStepConfig<Values>) {
  const [step, setStep] = useState(0);

  const isLastStep = useMemo(() => step === steps.length - 1, [step, steps]);

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, helpers) => {
      if (isLastStep) {
        await onSubmit(values, helpers);
      } else {
        setStep(step + 1);
      }
    },
    validationSchema: steps[step],
    ...rest,
  });

  const { validateForm } = formik;

  useEffect(() => {
    validateForm();
  }, [step, validateForm]);

  const previous = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step]);

  const value = useMemo(
    () => ({ ...formik, step, previous, isLastStep }),
    [formik, step, previous, isLastStep],
  );

  return value;
}
