import * as yup from 'yup';
// import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const SignupSchema = yup.object().shape({
  fullName: yup.string().required('form.required'),
  birthDate: yup
    .date()
    .test('age', 'form.birthDate.errorAge', (value) => {
      if (!value) return false;
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return value <= cutoff;
    })
    .required('form.required'),
  email: yup.string().email('form.email.error').required('form.required'),
  phone: yup
    .string()
    .test('valid-phone', 'form.phone.error', (value) => {
      if (!value) return false;
      // const parsedPhoneNumber = parsePhoneNumberFromString(value);
      // return Boolean(parsedPhoneNumber?.isValid());
      return true;
    })
    .required('form.required'),
  password: yup
    .string()
    .min(8, 'form.password.errorLength')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*?])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'form.password.errorAll',
    )
    .oneOf(
      [yup.ref('confirmPassword'), undefined],
      'form.confirmPassword.error',
    )
    .required('form.required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'form.confirmPassword.error')
    .required('form.required'),
});

export const SigninSchema = yup.object().shape({
  username: yup.string().required('form.required'),
  password: yup.string().required('form.required'),
});

export const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email('form.email.error').required('form.required'),
});
