import { useMemo } from 'react';
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
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import dimensions from '@/constants/dimensions';
import { SignupSchema } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';

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
    },
    button: {
      width: '80%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 28,
    },
  });
}

export default function SignUp() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(theme, insets), [theme, insets]);

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const { signUp } = useAuth();

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: SignupSchema,
    initialValues: {
      fullname: '',
      username: '',
      phone: '',
      birthDate: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: signUp,
  });

  const { isValid, handleChange, values } = formik;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Title>{i18n.t('auth.signup.title')}</Title>
      <TextInput
        label={i18n.t('form.fullname.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={handleChange('fullname')}
        value={values.fullname}
      />
      <TextInput
        label={i18n.t('form.username.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={handleChange('username')}
        value={values.username}
      />
      <View style={styles.input}>
        <DatePickerInput
          mode="outlined"
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
        mode="outlined"
        onChangeText={handleChange('email')}
        value={values.email}
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        label={i18n.t('form.phone.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={handleChange('phone')}
        value={values.phone}
        inputMode="tel"
        keyboardType="phone-pad"
        autoComplete="tel"
      />
      <TextInput
        label={i18n.t('form.password.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={handleChange('password')}
        value={values.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
      />
      <TextInput
        label={i18n.t('form.confirmPassword.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={handleChange('confirmPassword')}
        value={values.confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
      />
      <Button style={styles.button} mode="contained" disabled={!isValid}>
        {i18n.t('auth.signup.button')}
      </Button>
      <View style={styles.row}>
        <Text>{i18n.t('auth.signup.already')} </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignIn')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {i18n.t('auth.signin.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
