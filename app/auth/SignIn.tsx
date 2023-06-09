import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
  TextInput,
  Text,
  Button,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import { SigninSchema } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';
import { SnackbarState } from '@/types/ui';
import dimensions from '@/constants/dimensions';
import themes from '@/themes';
import { SignInPayload } from '@/types/auth';
import fieldError from '@/utils/fieldError';
import TextFieldHelperText from '@/components/TextFieldHelperText';
import SecureTextInput from '@/components/SecureTextInput';

function makeStyle(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      flex: 1,
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

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(insets), [insets]);
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof SignInPayload | null>(
    null,
  );

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'error',
    duration: 3000,
  });

  const formik = useFormik<SignInPayload>({
    validateOnMount: true,
    validationSchema: SigninSchema,
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signIn(values);
      } catch (error) {
        setSnackbar({
          open: true,
          message: i18n.t('auth.signin.error'),
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
    handleChange,
    handleSubmit,
    handleBlur,
  } = formik;

  return (
    <View style={styles.container}>
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
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text theme={themes.light.paper} variant="titleLarge">
        {i18n.t('auth.signin.title')}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
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
      <SecureTextInput
        autoComplete="password"
        theme={themes.light.paper}
        style={styles.input}
        label={i18n.t('form.password.field')}
        value={values.password}
        onChangeText={handleChange('password')}
        error={fieldError('password', errors, touched)}
        onFocus={() => setFocusedField('password')}
        onBlur={handleBlur('password')}
      />
      <TextFieldHelperText
        field="password"
        errors={errors}
        touched={touched}
        focusedField={focusedField}
      />
      <TouchableOpacity onPress={() => navigation.jumpTo('ForgotPassword')}>
        <Text theme={themes.light.paper} variant="bodyLarge">
          {i18n.t('auth.signin.forgotPassword')}
        </Text>
      </TouchableOpacity>
      <Button
        style={styles.button}
        mode="contained"
        disabled={!isValid || loading}
        onPress={() => handleSubmit()}
        theme={themes.light.paper}
      >
        {i18n.t('auth.signin.button')}
      </Button>
      <View style={styles.row}>
        <Text theme={themes.light.paper} variant="bodyLarge">
          {i18n.t('auth.signin.noAccount')}{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignUp')}>
          <Text variant="bodyLarge" style={styles.textImportant}>
            {i18n.t('auth.signup.button')}
          </Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbar.open}
        onDismiss={() => setSnackbar({ ...snackbar, open: false })}
        action={{
          label: 'OK',
          onPress: () => setSnackbar({ ...snackbar, open: false }),
        }}
        duration={snackbar.duration}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
