import { HelperText } from 'react-native-paper';
import { FormikErrors, FormikTouched } from 'formik';
import i18n from '@/languages';
import themes from '@/themes';

type Props<T> = {
  field: keyof T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  focusedField: keyof T | null;
};

export default function TextFieldHelperText<T>({
  field,
  errors,
  touched,
  focusedField,
}: Props<T>) {
  if (!errors[field] || !touched[field] || focusedField !== field) {
    return null;
  }

  return (
    <HelperText
      type="error"
      visible={!!errors[field] && !!touched[field]}
      theme={themes.light.paper}
    >
      {i18n.t(errors[field] as string)}
    </HelperText>
  );
}
