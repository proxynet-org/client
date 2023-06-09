import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import dimensions from '@/constants/dimensions';
import { SignupSchema } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';
import { SnackbarState } from '@/types/ui';
import themes from '@/themes';
import { SignUpPayload } from '@/types/auth';
import TextFieldHelperText from '@/components/TextFieldHelperText';
import fieldError from '@/utils/fieldError';
import SecureTextInput from '@/components/SecureTextInput';

function makeStyle(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      height: dimensions.window.height,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: insets.top,
      gap: 10,
    },
    input: {
      width: '80%',
      backgroundColor: themes.light.paper.colors.surface,
    },
    button: {
      width: '80%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 28,
      backgroundColor: 'transparent',
    },
    textImportant: {
      color: themes.light.paper.colors.primary,
      fontWeight: 'bold',
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -20,
      marginTop: -20,
      zIndex: 1,
    },
  });
}

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(insets), [insets]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof SignUpPayload | null>(
    null,
  );

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const { signUp } = useAuth();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'error',
    duration: 3000,
  });

  const formik = useFormik<SignUpPayload>({
    validateOnMount: true,
    validationSchema: SignupSchema,
    initialValues: {
      first_name: '',
      last_name: '',
      username: '',
      birthDate: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signUp(values);
      } catch (error) {
        setSnackbar({
          open: true,
          message: i18n.t('auth.signup.error'),
          type: 'error',
          duration: 3000,
        });
      }
      setLoading(false);
    },
  });

  const {
    isValid,
    values,
    touched,
    errors,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = formik;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ActivityIndicator
        animating={loading}
        hidesWhenStopped
        size="large"
        style={styles.loader}
      />
      <LinearGradient
        colors={['#aa74c2', '#deabe3']}
        style={{
          position: 'absolute',
          width: dimensions.screen.width,
          height: dimensions.screen.height,
        }}
      />
      <Text theme={themes.light.paper} variant="titleLarge">
        {i18n.t('auth.signup.title')}
      </Text>
      <TextInput
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.firstname.field')}
        value={values.first_name}
        onChangeText={handleChange('first_name')}
        error={fieldError('first_name', errors, touched)}
        onFocus={() => setFocusedField('first_name')}
        onBlur={handleBlur('first_name')}
      />
      <TextFieldHelperText
        field="first_name"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <TextInput
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.lastname.field')}
        value={values.last_name}
        onChangeText={handleChange('last_name')}
        error={fieldError('last_name', errors, touched)}
        onFocus={() => setFocusedField('last_name')}
        onBlur={handleBlur('last_name')}
      />
      <TextFieldHelperText
        field="last_name"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <TextInput
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.username.field')}
        value={values.username}
        onChangeText={handleChange('username')}
        error={fieldError('username', errors, touched)}
        onFocus={() => setFocusedField('username')}
        onBlur={handleBlur('username')}
      />
      <TextFieldHelperText
        field="username"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <View style={[styles.input, { backgroundColor: 'transparent' }]}>
        <DatePickerInput
          locale="en"
          inputMode="start"
          theme={themes.light.paper}
          style={styles.input}
          label={i18n.t('form.birthDate.field')}
          value={new Date(formik.values.birthDate || Date.now())}
          onChange={(value) => {
            setFieldTouched('birthDate', true);
            formik.setFieldValue('birthDate', value?.toISOString());
          }}
          error={fieldError('birthDate', errors, touched)}
          hasError={fieldError('birthDate', errors, touched)}
          onFocus={() => setFocusedField('birthDate')}
          onBlur={handleBlur('birthDate')}
        />
        <TextFieldHelperText
          field="birthDate"
          errors={errors}
          touched={touched}
          focusedField={focusedField}
        />
      </View>
      <TextInput
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.email.field')}
        value={values.email}
        onChangeText={handleChange('email')}
        error={fieldError('email', errors, touched)}
        onFocus={() => setFocusedField('email')}
        onBlur={handleBlur('email')}
      />
      <TextFieldHelperText
        field="email"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <SecureTextInput
        autoComplete="password-new"
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.password.field')}
        value={values.password}
        onChangeText={handleChange('password')}
        error={fieldError('password', errors, touched)}
        onBlur={handleBlur('password')}
        onFocus={() => setFocusedField('password')}
      />
      <TextFieldHelperText
        field="password"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <SecureTextInput
        autoComplete="password-new"
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.confirmPassword.field')}
        value={values.confirmPassword}
        onChangeText={handleChange('confirmPassword')}
        error={fieldError('confirmPassword', errors, touched)}
        onBlur={handleBlur('confirmPassword')}
        onFocus={() => setFocusedField('confirmPassword')}
      />
      <TextFieldHelperText
        field="confirmPassword"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <Button
        style={styles.button}
        mode="contained"
        disabled={!isValid || loading}
        onPress={() => handleSubmit()}
        theme={themes.light.paper}
      >
        {i18n.t('auth.signup.button')}
      </Button>
      <View style={styles.row}>
        <Text theme={themes.light.paper} variant="bodyLarge">
          {i18n.t('auth.signup.already')}{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignIn')}>
          <Text variant="bodyLarge" style={styles.textImportant}>
            {i18n.t('auth.signin.button')}
          </Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbar.open}
        onDismiss={() => setSnackbar({ ...snackbar, open: false })}
        action={{
          label: 'Ok',
          onPress: () => setSnackbar({ ...snackbar, open: false }),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </KeyboardAwareScrollView>
  );
}
