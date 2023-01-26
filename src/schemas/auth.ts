import * as Yup from 'yup';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required('form.required'),
  birthDate: Yup.date()
    .test('age', 'form.birthDate.errorAge', (value) => {
      if (!value) return false;
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return value <= cutoff;
    })
    .required('form.required'),
  email: Yup.string().email('form.email.error').required('form.required'),
  phone: Yup.string()
    .test('valid-phone', 'form.phone.error', (value) => {
      if (!value) return false;
      const parsedPhoneNumber = parsePhoneNumberFromString(value);
      return Boolean(parsedPhoneNumber?.isValid());
    })
    .required('form.required'),
  password: Yup.string()
    .min(8, 'form.password.errorLength')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*?])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'form.password.errorAll',
    )
    .oneOf([Yup.ref('confirmPassword'), null], 'form.confirmPassword.error')
    .required('form.required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'form.confirmPassword.error')
    .required('form.required'),
});

export const SigninSchema = Yup.object().shape({
  email: Yup.string().email('form.email.error').required('form.required'),
  password: Yup.string().required('form.required'),
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('form.email.error').required('form.required'),
});
