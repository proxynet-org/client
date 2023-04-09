import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
  Appbar,
  Button,
  HelperText,
  MD3Theme,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import { ForgotPasswordSchema } from '@/schemas/auth';
import { forgotPassword } from '@/api/auth';

function makeStyle(theme: MD3Theme, insets: EdgeInsets) {
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
    },
    button: {
      width: '80%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 28,
    },
    appBar: {
      width: '100%',
      top: insets.top,
      position: 'absolute',
    },
  });
}

export default function ForgotPassword() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(theme, insets), [theme, insets]);

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: ForgotPasswordSchema,
    initialValues: {
      email: '',
    },
    onSubmit: (values) => forgotPassword(values.email),
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isValid,
    touched,
  } = formik;

  return (
    <View style={styles.container}>
      <Appbar style={styles.appBar}>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => navigation.jumpTo('SignIn')}
        />
        <Appbar.Content title={i18n.t('auth.signin.title')} />
      </Appbar>
      <Title>{i18n.t('auth.forgotPassword.title')}</Title>
      <TextInput
        label={i18n.t('form.email.field')}
        style={styles.input}
        mode="outlined"
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        value={values.email}
        error={Boolean(errors.email && touched.email)}
      />
      {errors.email && touched.email && (
        <HelperText
          type="error"
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: '10%',
          }}
        >
          {i18n.t(errors.email)}
        </HelperText>
      )}
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => handleSubmit()}
        disabled={!isValid}
      >
        {i18n.t('auth.forgotPassword.button')}
      </Button>
    </View>
  );
}
