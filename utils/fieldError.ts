import { FormikErrors, FormikTouched } from 'formik';

export default function fieldError<T>(
  field: keyof T,
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
) {
  return !!errors[field] && !!touched[field];
}
