import * as Yup from 'yup';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  birthDate: Yup.date().required('Birthdate is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .test('valid-phone', 'Invalid phone number', (value) => {
      if (!value) return false;
      const parsedPhoneNumber = parsePhoneNumberFromString(value);
      return Boolean(parsedPhoneNumber?.isValid());
    })
    .required('Phone is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*?])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    )
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});
