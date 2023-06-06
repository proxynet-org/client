import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Title,
  TextInput,
  MD3Theme,
  useTheme,
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

function makeStyle(theme: MD3Theme, insets: EdgeInsets) {
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
      backgroundColor: theme.colors.surface,
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
    textImportant: { color: theme.colors.primary, fontWeight: 'bold' },
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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(theme, insets), [theme, insets]);
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const { signUp } = useAuth();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'error',
    duration: 3000,
  });

  const formik = useFormik({
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

  const { isValid, handleChange, values, handleSubmit } = formik;

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
      <Title>{i18n.t('auth.signup.title')}</Title>
      <TextInput
        label={i18n.t('form.firstname.field')}
        style={styles.input}
        onChangeText={handleChange('first_name')}
        value={values.first_name}
      />
      <TextInput
        label={i18n.t('form.lastname.field')}
        style={styles.input}
        onChangeText={handleChange('last_name')}
        value={values.last_name}
      />
      <TextInput
        label={i18n.t('form.username.field')}
        style={styles.input}
        onChangeText={handleChange('username')}
        value={values.username}
      />
      <View style={[styles.input, { backgroundColor: 'transparent' }]}>
        <DatePickerInput
          style={styles.input}
          locale="en"
          label="Birthdate"
          inputMode="start"
          onChange={(value) =>
            formik.setFieldValue('birthDate', value?.toISOString())
          }
          value={new Date(formik.values.birthDate || Date.now())}
        />
      </View>
      <TextInput
        label={i18n.t('form.email.field')}
        style={styles.input}
        onChangeText={handleChange('email')}
        value={values.email}
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        label={i18n.t('form.password.field')}
        style={styles.input}
        onChangeText={handleChange('password')}
        value={values.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
      />
      <TextInput
        label={i18n.t('form.confirmPassword.field')}
        style={styles.input}
        onChangeText={handleChange('confirmPassword')}
        value={values.confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
      />
      <Button
        style={styles.button}
        mode="contained"
        disabled={!isValid || loading}
        onPress={() => handleSubmit()}
      >
        {i18n.t('auth.signup.button')}
      </Button>
      <View style={styles.row}>
        <Text variant="bodyLarge">{i18n.t('auth.signup.already')} </Text>
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
